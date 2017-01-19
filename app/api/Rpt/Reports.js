
var sql = require('mssql');
var dateFormat = require('dateformat');
import { remote,ipcRenderer } from 'electron';
import * as CONNECT from "../SQLConst.js"
import * as ACTION from "../../actions/Rpt/Const.js"
import * as STATE from "../../actions/Rpt/State.js"
import * as MISC from "../Misc.js"
import * as PROGRESSBUTTON from "../../actions/ProgressButtonConst.js"
import * as SQLPRIMEDB from "../SQLPrimeDB.js"
import * as SQLOPENPO from "./SQLOpenPO.js"
import * as SQLOPENPOVENDOREMAIL from "./SQLOpenPOVendorEmail.js"

//import * as hashLeftOuterJoin from "lodash-joins/lib/hash/hashLeftOuterJoin.js"
var Moment = require('moment');
var _ = require('lodash');
var joins = require('lodash-joins');
var sorty    = require('sorty')
var fs = require('fs');
//var client = require("jsreport-client")('http://10.1.1.217:5488', 'admin', 'password')
var client = require("jsreport-client")('http://localhost:5488', 'admin', 'password')


export async function ClosedPOPrompt(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var cnt=0;
  var maxCnt=10;

  dispatch({type:ACTION.INIT_NO_STATE});
  if(continueProcess){
    dispatch({type:ACTION.SET_CLOSEDPO_DATE_START,dateStart:Moment().startOf('day').toDate()});
    dispatch({type:ACTION.SET_CLOSEDPO_DATE_END,dateEnd:Moment().endOf('day').toDate()});
    dispatch({type:ACTION.SET_STATE, state:STATE.CLOSEDPO_DATE_RANGE_READY});
  }
}
export async function ClosedPODateRange(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var closedPO=getState().Reports.closedPO;
  if ('development'==process.env.NODE_ENV) {
    console.log(`ClosedPODateRange().dateStart=>${closedPO.dateStart}`);
    console.log(`ClosedPODateRange().dateEnd=>${closedPO.dateEnd}`);
  }
  var valid;
  if(
      (null==closedPO.dateStart) ||
      (null==closedPO.dateEnd) ||
      (closedPO.dateStart>=closedPO.dateEnd )
    )
  {
    valid=false;
    dispatch({ type:ACTION.SET_CLOSEDPO_DATE_HEADER, dateHeader:{text:'Date Range Error!',valid:false} });
  }else{
    valid=true;
    dispatch({ type:ACTION.SET_CLOSEDPO_DATE_HEADER, dateHeader:{text:'Date Range',valid:true} });

  }
  if(valid   ){
    dispatch({ type:ACTION.SET_STATE, state:STATE.CLOSEDPO_DATE_RANGE_READY});
  }else{
    dispatch({ type:ACTION.SET_STATE, state:STATE.CLOSEDPO_DATE_RANGE_NOT_READY });
  }

}


export async function ClosedPO(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;



  var dirName=remote.app.getPath('temp');

  if ('development'==process.env.NODE_ENV) {
    console.log(`remote = } `);
    console.dir(remote);
    console.log(` dirName: ${ dirName}`);
  }

  if(continueProcess){
    var closedPO=getState().Reports.closedPO;
    if ('development'==process.env.NODE_ENV) {
      console.log(`ClosedPODateRange().dateStart=>${closedPO.dateStart}`);
      console.log(`ClosedPODateRange().dateEnd=>${closedPO.dateEnd}`);
    }


    var dateStart = closedPO.dateStart;
    var dtStart =Moment(new Date(closedPO.dateStart)).format("MM-DD-YYYY HH:mm:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtStart=>${dtStart}`);
    }



    var dateEnd = closedPO,dateEnd;
    var dtEnd =Moment(new Date(closedPO.dateEnd)).format("MM-DD-YYYY HH:mm:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtEnd=>${dtEnd}`);
    }

    var dtStartFmt = dateFormat(new Date(closedPO.dateStart), "mm-dd-yyyy HH:MM:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtStartFmt=>${dtStartFmt}`);
    }
    var dtEndFmt = dateFormat(new Date(closedPO.dateEnd), "mm-dd-yyyy HH:MM:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtEndFmt=>${dtEndFmt}`);
    }


    dispatch({ type:ACTION.SET_PROGRESS_BTN,progressBtn:PROGRESSBUTTON.LOADING });
    dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });
    client.render({

        template: { shortid:"r1omgHrLe"},
//        data: { dtStart: "01-17-2017 00:00:00",dtEnd:"01-18-2017 23:15:10"}
        data: { dtStart: dtStart,dtEnd:dtEnd}

/*
  "dtStart": "01-17-2017 00:00:00",
  "dtEnd": "01-18-2017 23:15:10"
*/
//        data: { subject: "Busche Order",po: "122572",emailTo:"bgroves3196@yahoo.com"}
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
          dispatch({ type:ACTION.SET_CLOSEDPO_REPORT_DONE, done:true });
          if ('development'==process.env.NODE_ENV) {
            console.log(`Done creating file myfile.pdf `);
            console.log(`fileName: ${fileName}`);
          }
          ipcRenderer.send('asynchronous-message', fileName)
        });
    });
    var cnt=0;
    var maxCnt=15;
    while(!getState().Reports.closedPO.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().Reports.closedPO.failed || 
      !getState().Reports.closedPO.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`ClosedPOReport not successful.`);
      }
      dispatch({ type:ACTION.SET_REASON, reason:`Network or server problem preventing access to the Report Server. `});
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SET_STATUS, status:'Can not connect to Report Server...' });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`ClosedPOReport Success.`);
      }
      dispatch({ type:ACTION.SET_STATE, state:STATE.SUCCESS});
    }
  }
}



export async function OpenPOMailer(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
}



export async function DebugPOStatusReport(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  dispatch({ type:ACTION.SET_PROGRESS_BTN,progressBtn:PROGRESSBUTTON.LOADING });
  dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });

  for(var x=0;x<10;x++){
    client.render({

  //      template: { shortid:"HJEa3YSNl"}
//        template:{shortid:"rk6jlpXLl"},

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

export async function POStatusReport(disp,getSt) {
//async function IteratePOStatusReport(disp,getSt) {
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

        template: { shortid:"rk6jlpXLl"},
  //      template: { shortid:"SkVLXedVe"}, // sample report
  //      template: { content: "hello {{:someText}}", recipe: "html",
  //                  engine: "jsrender" },
  //      data: { someText: "world!!",po:"" }
        data: { po: "122572",emailTo:"bgroves3196@yahoo.com",subject:"Busche Order"}

//        data: { subject: "Busche Order",po: "122572",emailTo:"bgroves3196@yahoo.com"}
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
    var maxCnt=10;
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


export async function OpenPOVendorDateRange(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var openPO=getState().Reports.openPO;
  if ('development'==process.env.NODE_ENV) {
    console.log(`OpenPOVendorDateRange().dateStart=>${openPO.dateStart}`);
    console.log(`OpenPOVendorDateRange().dateEnd=>${openPO.dateEnd}`);
  }
  if(
      (null==openPO.dateStart) ||
      (null==openPO.dateEnd) ||
      (openPO.dateStart>openPO.dateEnd )
    )
  {
    dispatch({ type:ACTION.SET_OPENPO_DATE_HEADER, dateHeader:{text:'Date Range Error!',valid:false} });
  }else{
    dispatch({ type:ACTION.SET_OPENPO_DATE_HEADER, dateHeader:{text:'Date Range',valid:true} });

  }
  if(
      (!openPO.emailMRO && !openPO.emailVendor) 
    )
  {
    dispatch({ type:ACTION.SET_OPENPO_EMAIL_HEADER, emailHeader:{text:'One Email recipient!',valid:false}});
  }else{
    dispatch({ type:ACTION.SET_OPENPO_EMAIL_HEADER, emailHeader:{text:'Email',valid:true}});
  }
  if(
    ((0==openPO.select.length) && (null==openPO.dateStart) || (null==openPO.dateEnd)) ||
    (openPO.dateStart>openPO.dateEnd || (!openPO.emailMRO && !openPO.emailVendor))
    ){
    dispatch({ type:ACTION.SET_STATE, state:STATE.OPENPO_DATE_RANGE_NOT_READY });
  }else{
    dispatch({ type:ACTION.SET_STATE, state:STATE.OPENPO_DATE_RANGE_READY });
  }
}


export async function OpenPO(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var cnt=0;
  var maxCnt=10;
  var state=getState();
  var openPO=getState().Reports.openPO;

  dispatch({type:ACTION.INIT_NO_STATE});
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
      SQLOPENPO.sql1(disp,getSt);
    });
    cnt=0;
    maxCnt=10;
    while(!getState().Reports.sqlOpenPO.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().Reports.sqlOpenPO.failed || 
      !getState().Reports.sqlOpenPO.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLOPENPO.sql1() FAILED.`);
      }
      dispatch({ type:ACTION.SET_REASON, reason:`bpOpenPO FAILED. ` });
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SET_STATUS, status:'Can not run bpOpenPO sproc on Cribmaster...' });
      continueProcess=false;
    }else if(0<getState().Reports.openPO.po.length){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLOPENPO.sql1() Success.`);
      }
    }else{
      dispatch({ type:ACTION.SET_STATE, state:STATE.OPENPO_NO_RECORDS });
      continueProcess=false;
    }
  }

  if(continueProcess){
    dispatch({type:ACTION.SET_OPENPO_DATE_START,dateStart:Moment().startOf('day').toDate()});
    dispatch({type:ACTION.SET_OPENPO_DATE_END,dateEnd:Moment().startOf('day').toDate()});
    dispatch({type:ACTION.SET_STATE, state:STATE.OPENPO_DATE_RANGE_NOT_READY});
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
/*
  if(continueProcess){
    dispatch({ type:ACTION.SET_STATE, state:STATE.OPENPO_DATE_RANGE_NOT_READY });
  }
  */
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
    }else if(0<getState().Reports.openPO.poItem.length){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLOPENPOVENDOREMAIL.sql1() Success.`);
      }
    }else{
      dispatch({ type:ACTION.SET_STATE, state:STATE.OPENPO_DATE_RANGE_NO_RECORDS });
      continueProcess=false;
    }
  }


  if ('development'==process.env.NODE_ENV) {
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
    if(0<getState().Reports.openPO.select.length){
      dispatch({ type:ACTION.SET_STATE, state:STATE.PO_PROMPT_READY });
    }else{
      dispatch({ type:ACTION.SET_STATE, state:STATE.PO_PROMPT_NOT_READY });
    }
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


export async function ToggleOpenPOSelected(disp,getSt,po) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var cnt=0;
  var maxCnt=10;


//  var openPO = getState().Reports.openPO;
//  var poItem = getState().Reports.openPO.poItem;
  var poNumber = po;

  if ('development'==process.env.NODE_ENV) {
    console.log(`ToggleOpenPOSelected.top()=>`);
    console.log(`poNumber=>${poNumber}`);
    console.log(`poItem=>`);
    console.dir(getState().Reports.openPO.poItem);
  }

  var anySelected=false;
  var poItemNew = _.map(getState().Reports.openPO.poItem).map(function(x){
    var newSelected;
    if(poNumber==x.poNumber){
      if(0==x.selected){
        newSelected=1;
      }else{
        newSelected=0;
      }
    }else{
      newSelected=x.selected;
    }
    if(1==newSelected){
      anySelected=true;
    }
    var poItemAdd = _.assign(x, {'selected':newSelected});
    return poItemAdd; 
  });

  dispatch({ type:ACTION.SET_OPENPO_POITEM, poItem:poItemNew });


  if(anySelected){
    dispatch({ type:ACTION.SET_STATE, state:STATE.PO_PROMPT_READY});
  }else{
    dispatch({ type:ACTION.SET_STATE, state:STATE.PO_PROMPT_NOT_READY});
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
  var emailMRO=getState().Reports.openPO.emailMRO;
  var emailVendor=getState().Reports.openPO.emailVendor;
  getState().Reports.openPO.poItem.map(function(x){
    if(x.selected && curPO!=x.poNumber){
      var emailTo=null;
      if(emailMRO){
//         emailTo='Administrator@busche-cnc.com'; 
         emailTo='nswank@buschegroup.com'; 
      }
      if(emailVendor && ('None'!=x.eMailAddress.trim())){
        if(null==emailTo){
          emailTo=x.eMailAddress.trim();
        }else{
          emailTo+=',' + x.eMailAddress.trim();
        }
      }
//Administrator@busche-cnc.com
      if ('development'==process.env.NODE_ENV) {
        console.log(`OpenPOVendorEmailReport.poNumber=${x.poNumber}`);
        console.log(`OpenPOVendorEmailReport.poNumber=${x.eMailAddress}`);
        console.log(`emailTo=${emailTo}`);
      }

      if(null!=emailTo){
        client.render({
          template: { shortid:"rk6jlpXLl"},
          data: {po: x.poNumber,emailTo:emailTo,subject:"Busche Order"}

        }, function(err, response) {
            if ('development'==process.env.NODE_ENV) {
            }
            response.body(function(body) {
              if ('development'==process.env.NODE_ENV) {
              }
            });
        });
      }
      curPO=x.poNumber;
    }
   
  });
  await MISC.sleep(6000);
  dispatch({ type:ACTION.SET_STATE, state:STATE.SUCCESS});
}
