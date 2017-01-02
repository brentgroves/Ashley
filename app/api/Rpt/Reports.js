
var sql = require('mssql');

import { remote,ipcRenderer } from 'electron';
import * as CONNECT from "../SQLConst.js"
import * as ACTION from "../../actions/Rpt/Const.js"
import * as STATE from "../../actions/Rpt/State.js"
import * as MISC from "../Misc.js"
import * as PROGRESSBUTTON from "../../actions/ProgressButtonConst.js"
import * as SQLPRIMEDB from "../SQLPrimeDB.js"
import * as SQLOPENPOVENDOREMAIL from "./SQLOpenPOVendorEmail.js"

//import * as hashLeftOuterJoin from "lodash-joins/lib/hash/hashLeftOuterJoin.js"
var _ = require('lodash');
var joins = require('lodash-joins');
var sorty    = require('sorty')
var fs = require('fs');
var client = require("jsreport-client")('http://10.1.1.217:5488', 'admin', 'password')



export async function OpenPOMailer(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
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

export async function OpenPOVendorEmail(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var cnt=0;
  var maxCnt=10;
  var state=getState();
  var openPO=getState().Reports.openPO;

  dispatch({ type:ACTION.SET_PROGRESS_BTN,progressBtn:PROGRESSBUTTON.LOADING });
  dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });

  dispatch((dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    SQLPRIMEDB.sql1(disp,getSt);
  });
  
  maxCnt=10;
  cnt=0;
  while(!getState().Common.primed){
    if(++cnt>maxCnt ){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }
  if(!getState().Common.primed){
    if ('development'==process.env.NODE_ENV) {
      console.log(`primeDB FAILED.`);
    }
    continueProcess=false;
    dispatch({ type:ACTION.SET_REASON, reason:`primeDB FAILED. ` });
    dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
    dispatch({ type:ACTION.SET_STATUS, status:'Can not connect to Cribmaster...' });
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`prime Success.`);
    }
  }


  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLOPENPOVENDOREMAIL.sql1(disp,getSt);
    });
    cnt=0;
    maxCnt=10;
    while(!getState().Reports.sqlOpenPOVendorEmail.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().Reports.sqlOpenPOVendorEmail.failed || 
      !getState().Reports.sqlOpenPOVendorEmail.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLOPENPOVENDOREMAIL.sql1() FAILED.`);
      }
      dispatch({ type:ACTION.SET_REASON, reason:`bpOpenPOVendorEmail FAILED. ` });
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SET_STATUS, status:'Can not run bpOpenPOVendorEmail sproc on Cribmaster...' });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLOPENPOVENDOREMAIL.sql1() Success.`);
      }
    }
  }


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


export async function ToggleOpenPOVisible(disp,getSt,po) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var cnt=0;
  var maxCnt=10;


//  var openPO = getState().Reports.openPO;
//  var poItem = getState().Reports.openPO.poItem;
  var poNumber = po;

  if ('development'==process.env.NODE_ENV) {
    console.log(`ToggleOpenPOVisible.top()=>`);
    console.log(`poNumber=>${poNumber}`);
    console.log(`poItem=>`);
    console.dir(getState().Reports.openPO.poItem);
  }

  var poItemNew = _.map(getState().Reports.openPO.poItem).map(function(x){
    var newVisible;
    if(poNumber==x.poNumber){
      newVisible=!x.visible;
    }else{
      newVisible=x.visible;
    }
    var poItemAdd = _.assign(x, {'visible':newVisible});
    return poItemAdd; 
  });

  dispatch({ type:ACTION.SET_OPENPO_POITEM, poItem:poItemNew });


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
      dispatch({ type:ACTION.SET_REASON, reason:`ToggleOpenPOVisible() FAILED. ` });
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SET_STATUS, status:'Can not update OpenPO poItem page...' });
      continueProcess=false;
    }
  }
}

export function OpenPOPager(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var curPO = 'start';
  var rowCount = 0;
  var pageIndex = 0;
  var page=1;
  const ROWS_PER_PAGE=8;
  var poChange=false;
  if ('development'==process.env.NODE_ENV) {
    console.log(`OpenPOPager() poItem=>`);
    console.dir(getState().Reports.openPO.poItem);
  }

  dispatch({ type:ACTION.OPENPO_PAGER_FAILED, failed:false });
  dispatch({ type:ACTION.OPENPO_PAGER_DONE, done:false });


  var poItemNew=getState().Reports.openPO.poItem.map(function(poItem){
    if(false==poItem.visible){
      if(curPO!=poItem.poNumber){
        rowCount+=1;
        pageIndex+=1;
        if('start' != curPO){
          poChange=true;
        }
        curPO=poItem.poNumber;
      }
    }else{
      if(curPO!=poItem.poNumber){
        rowCount+=2;
        pageIndex+=2;
        if('start' != curPO){
          poChange=true;
        }
        curPO=poItem.poNumber;
      }else{
        rowCount+=1;
        pageIndex+=1;
      }
    }
    if ('development'==process.env.NODE_ENV) {
      console.log(`OpenPOPager() poItem.poNumber / poItem.itemDescription=>${poItem.poNumber} / ${poItem.itemDescription}`);
      console.log(`OpenPOPager() rowCount=>${rowCount}`);
      console.log(`OpenPOPager() Before page change=>${page}`);
      console.log(`OpenPOPager() Before pageIndex change=>${pageIndex}`);
    }

    if(poChange && poItem.visible && ((ROWS_PER_PAGE+1)==pageIndex)){
      // 2 rows added
      pageIndex=2;
      page+=1;
    }else if(poChange && !poItem.visible && ((ROWS_PER_PAGE+1)==pageIndex)){
      // 1 rows added
      pageIndex=1;
      page+=1;
    }else if(poChange && poItem.visible && ((ROWS_PER_PAGE+2)==pageIndex)){
      // 2 rows added
      pageIndex=2;
      page+=1;
    }else if(poChange && !poItem.visible && ((ROWS_PER_PAGE+2)==pageIndex)){
      // cant happen
    }else if(!poChange && poItem.visible && (ROWS_PER_PAGE<pageIndex)){
      // 1 row added
      pageIndex=1;
      page+=1;
    }else if(!poChange && !poItem.visible && (ROWS_PER_PAGE<pageIndex)){
      // no rows added
    }
    if ('development'==process.env.NODE_ENV) {
      console.log(`OpenPOPager() After pageIndex change =>${pageIndex}`);
      console.log(`OpenPOPager() After page change=>${page}`);
    }
    poItem.page=page;
    poChange=false;
    return poItem;
  });
  if ('development'==process.env.NODE_ENV) {
    console.log(`OpenPOPager() poItemNew`);
    console.dir(poItemNew);
  }
  var maxPage=page;    
  dispatch({ type:ACTION.SET_OPENPO_MAXPAGE, maxPage:page });
  dispatch({ type:ACTION.SET_OPENPO_POITEM, poItem:poItemNew });
  if(getState().Reports.openPO.curPage>maxPage){
    dispatch({ type:ACTION.SET_OPENPO_CURPAGE, curPage:maxPage });
  }

  dispatch({ type:ACTION.OPENPO_PAGER_DONE, done:true });

}

export async function OpenPOVendorEmailReport(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  dispatch({ type:ACTION.SET_PROGRESS_BTN,progressBtn:PROGRESSBUTTON.LOADING });
  dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });
  var curPO='start';
  getState().Reports.openPO.poItem.map(function(x){
    if(x.selected && curPO!=x.poNumber){
      if ('development'==process.env.NODE_ENV) {
        console.log(`OpenPOVendorEmailReport.poNumber=${x.poNumber}`);
      }
      curPO=x.poNumber;
    }
    
/*
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
    */
  });
  await MISC.sleep(6000);
  dispatch({ type:ACTION.SET_STATE, state:STATE.SUCCESS});
}
