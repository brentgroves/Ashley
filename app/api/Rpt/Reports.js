
var sql = require('mssql');

import { remote,ipcRenderer } from 'electron';



import * as CONNECT from "../SQLConst.js"
import * as ACTION from "../../actions/Rpt/Const.js"
import * as STATE from "../../actions/Rpt/State.js"
import * as MISC from "../Misc.js"
import * as PROGRESSBUTTON from "../../actions/ProgressButtonConst.js"

//import * as hashLeftOuterJoin from "lodash-joins/lib/hash/hashLeftOuterJoin.js"
var _ = require('lodash');
var joins = require('lodash-joins');
var sorty    = require('sorty')
var fs = require('fs');
var client = require("jsreport-client")('http://10.1.1.217:5488', 'admin', 'password')

export function OpenPOPager(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var poItem = getState().Reports.openPO.poItem;
  var curPO = 'start';
  var rowCount = 0;
  var pageIndex = 0;
  var page=1;
  const ROWS_PER_PAGE=8;
  if ('development'==process.env.NODE_ENV) {
    console.log(`OpenPOPager() poItem=>`);
    console.dir(poItem);
  }

  dispatch({ type:ACTION.OPENPO_PAGER_FAILED, failed:false });
  dispatch({ type:ACTION.OPENPO_PAGER_DONE, done:false });


  var poItemNew=poItem.map(function(poItem){
    if(false==poItem.visible){
      if(curPO!=poItem.fpono){
        rowCount+=1;
        pageIndex+=1;
        curPO=poItem.fpono;
      }
    }else{
      if(curPO!=poItem.fpono){
        rowCount+=2;
        pageIndex+=2;
        curPO=poItem.fpono;
      }else{
        rowCount+=1;
        pageIndex+=1;
      }
    }
    if(ROWS_PER_PAGE<pageIndex){
      pageIndex=0;
      page+=1;
    }
    poItem.page=page;
    return poItem;
  });

  dispatch({ type:ACTION.SET_OPENPO_MAXPAGE, maxPage:page });
  dispatch({ type:ACTION.SET_OPENPO_POITEM, poItem:poItemNew });
  dispatch({ type:ACTION.OPENPO_PAGER_DONE, done:true });

}


export async function OpenPOMailer(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
}

export async function POPrompt(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var cnt=0;
  var maxCnt=10;
  var state=getState();
  var openPO=getState().Reports.openPO;

  dispatch({ type:ACTION.SET_PROGRESS_BTN,progressBtn:PROGRESSBUTTON.LOADING });
  dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });

  // TO DO ADD SQL CALL TO LOAD POITEMS
  if ('development'==process.env.NODE_ENV) {
   console.log(`POPrompt() state=>`);
    console.dir(state);
     console.log(`POPrompt() openPO=>`);
    console.dir(openPO);
  }

  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      OpenPOPager(disp,getSt);
    });

    cnt=0;
    maxCnt=10;

    while(!getState().Reports.openPOPager.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }
    if(getState().Reports.openPOPager.failed ||
      !getState().Reports.openPOPager.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`OpenPOPager() FAILED.`);
      }
      dispatch({ type:ACTION.SET_REASON, reason:`OpenPOPager() FAILED. ` });
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SET_STATUS, status:'Can not update OpenPO poItem page...' });
      continueProcess=false;
    }
  }

  if(continueProcess){
    dispatch({ type:ACTION.SET_STATE, state:STATE.PO_PROMPT_NOT_READY });
  }


}



export async function POStatusReport(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  dispatch({ type:ACTION.SET_PROGRESS_BTN,progressBtn:PROGRESSBUTTON.LOADING });
  dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });

  for(var x=0;x<10;x++){
    client.render({

  //      template: { shortid:"HJEa3YSNl"}
        template: { shortid:"SkVLXedVe"} // sample report
    }, function(err, response) {
        if ('development'==process.env.NODE_ENV) {
        }
      //dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      //dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      //dispatch({ type:GRACTION.LOG_ENTRY_LAST_FAILED, failed:true });

        response.body(function(body) {
          if ('development'==process.env.NODE_ENV) {
          }
        });
    });
  }
  await MISC.sleep(6000);
  dispatch({ type:ACTION.SET_STATE, state:STATE.SUCCESS});
}

async function IteratePOStatusReport(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;


  //remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
//  dispatch({ type:ACTION.SET_PROGRESS_BTN,progressBtn:PROGRESSBUTTON.LOADING });
//  dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });

  var dirName=remote.app.getPath('temp');

  if ('development'==process.env.NODE_ENV) {
    console.log(`remote = } `);
    console.dir(remote);
    console.log(` dirName: ${ dirName}`);
  }

  if(continueProcess){
    client.render({

  //      template: { shortid:"HJEa3YSNl"}
        template: { shortid:"SkVLXedVe"} // sample report
    }, function(err, response) {
        var dirName1 = dirName;

        if ('development'==process.env.NODE_ENV) {
          console.log(`dirName: ${dirName}`);
          console.log(`dirName1: ${dirName1}`);
          console.log(`err =  `);
          console.dir(err);
        }
      //dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      //dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      //dispatch({ type:GRACTION.LOG_ENTRY_LAST_FAILED, failed:true });

        response.body(function(body) {
          var dirName2 = dirName1;
          let fileName =  dirName2 + '/myfile.pdf';
          if ('development'==process.env.NODE_ENV) {
            console.log(`dirName: ${dirName}`);
            console.log(`dirName1: ${dirName1}`);
            console.log(`dirName2: ${dirName2}`);
            console.log(`fileName: ${fileName}`);
          }

          fs.writeFileSync(fileName,body);
          dispatch({ type:ACTION.SET_POSTATUS_REPORT_DONE, done:true });
          if ('development'==process.env.NODE_ENV) {
            console.log(`Done creating file myfile.pdf `);
            console.log(`fileName: ${fileName}`);
          }
          ipcRenderer.send('asynchronous-message', fileName)
        });
    });

    var cnt=0;
    var maxCnt=40;
    while(!getState().Reports.poStatusReport.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().Reports.poStatusReport.failed || 
      !getState().Reports.poStatusReport.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`POStatusReport not successful.`);
      }
      dispatch({ type:ACTION.SET_REASON, reason:`Network or server problem preventing access to the Report Server. `});
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SET_STATUS, status:'Can not connect to Report Server...' });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`POStatusReport Success.`);
      }
      dispatch({type:ACTION.INIT_NO_STATE});
      dispatch({ type:ACTION.SET_STATE, state:STATE.SUCCESS});
    }
  }

}


export async function POVendorEmail(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;


  //remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
  dispatch({ type:ACTION.SET_PROGRESS_BTN,progressBtn:PROGRESSBUTTON.LOADING });
  dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });

  var dirName=remote.app.getPath('temp');

  if ('development'==process.env.NODE_ENV) {
    console.log(`remote = } `);
    console.dir(remote);
    console.log(` dirName: ${ dirName}`);
  }

  if(continueProcess){
    client.render({

  //      template: { shortid:"HJEa3YSNl"}
        template: { shortid:"SkVLXedVe"} // sample report
//http://10.1.1.217:5488/templates/B1WBsctr4e
  //      template: { content: "hello {{:someText}}", recipe: "html",
  //                  engine: "jsrender" },
  //      data: { someText: "world!!" }
    }, function(err, response) {
        var dirName1 = dirName;

        if ('development'==process.env.NODE_ENV) {
          console.log(`dirName: ${dirName}`);
          console.log(`dirName1: ${dirName1}`);
          console.log(`err =  `);
          console.dir(err);
        }
      //dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      //dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      //dispatch({ type:GRACTION.LOG_ENTRY_LAST_FAILED, failed:true });

        response.body(function(body) {
          var dirName2 = dirName1;
          let fileName =  dirName2 + '/myfile.pdf';
          if ('development'==process.env.NODE_ENV) {
            console.log(`dirName: ${dirName}`);
            console.log(`dirName1: ${dirName1}`);
            console.log(`dirName2: ${dirName2}`);
            console.log(`fileName: ${fileName}`);
          }

          fs.writeFileSync(fileName,body);
//          fs.writeFileSync('/home/brent/myfile.pdf',body);
          dispatch({ type:ACTION.SET_POSTATUS_REPORT_DONE, done:true });
          if ('development'==process.env.NODE_ENV) {
            console.log(`Done creating file myfile.pdf `);
            console.log(`fileName: ${fileName}`);
          }
          ipcRenderer.send('asynchronous-message', fileName)
          //dispatch({ type:GRACTION.SET_POSTATUS_REPORT_PDF, pdf:body });
        });
    });

    var cnt=0;
    var maxCnt=40;
    while(!getState().Reports.poStatusReport.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().Reports.poStatusReport.failed || 
      !getState().Reports.poStatusReport.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`POStatusReport not successful.`);
      }
      dispatch({ type:ACTION.SET_REASON, reason:`Network or server problem preventing access to the Report Server. `});
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SET_STATUS, status:'Can not connect to Report Server...' });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`POStatusReport Success.`);
      }
      
      dispatch({type:ACTION.INIT_NO_STATE});
      dispatch({ type:ACTION.SET_STATE, state:STATE.SUCCESS});
    }
  }

}
