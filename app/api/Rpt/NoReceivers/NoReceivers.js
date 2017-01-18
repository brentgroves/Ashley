
var sql = require('mssql');
var dateFormat = require('dateformat');
import { remote,ipcRenderer } from 'electron';
import * as CONNECT from "../../SQLConst.js"
import * as ACTION from "../../../actions/Rpt/Const.js"
import * as STATE from "../../../actions/Rpt/State.js"
import * as MISC from "../../Misc.js"
import * as PROGRESSBUTTON from "../../../actions/ProgressButtonConst.js"
import * as SQLPRIMEDB from "../../SQLPrimeDB.js"

//import * as hashLeftOuterJoin from "lodash-joins/lib/hash/hashLeftOuterJoin.js"
var Moment = require('moment');
var _ = require('lodash');
var joins = require('lodash-joins');
var sorty    = require('sorty')
var fs = require('fs');
var client = require("jsreport-client")('http://10.1.1.217:5488', 'admin', 'password')


export async function NoReceiversPrompt(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var cnt=0;
  var maxCnt=10;

  dispatch({type:ACTION.INIT_NO_STATE});
  if(continueProcess){
    dispatch({type:ACTION.SET_NORECEIVERS_DATE_START,dateStart:Moment().startOf('day').toDate()});
    dispatch({type:ACTION.SET_NORECEIVERS_DATE_END,dateEnd:Moment().endOf('day').toDate()});
    dispatch({type:ACTION.SET_STATE, state:STATE.NORECEIVERS_DATE_RANGE_READY});
  }
}
export async function NoReceiversDateRange(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var noReceivers=getState().Reports.noReceivers;
  if ('development'==process.env.NODE_ENV) {
    console.log(`NoReceiversDateRange().dateStart=>${noReceivers.dateStart}`);
    console.log(`NoReceiversDateRange().dateEnd=>${noReceivers.dateEnd}`);
  }
  var valid;
  if(
      (null==noReceivers.dateStart) ||
      (null==noReceivers.dateEnd) ||
      (noReceivers.dateStart>=noReceivers.dateEnd )
    )
  {
    valid=false;
    dispatch({ type:ACTION.SET_NORECEIVERS_DATE_HEADER, dateHeader:{text:'Date Range Error!',valid:false} });
  }else{
    valid=true;
    dispatch({ type:ACTION.SET_NORECEIVERS_DATE_HEADER, dateHeader:{text:'Date Range',valid:true} });

  }
  if(valid   ){
    dispatch({ type:ACTION.SET_STATE, state:STATE.NORECEIVERS_DATE_RANGE_READY});
  }else{
    dispatch({ type:ACTION.SET_STATE, state:STATE.NORECEIVERS_DATE_RANGE_NOT_READY });
  }

}


export async function NoReceivers(disp,getSt) {
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
    var noReceivers=getState().Reports.noReceivers;
    if ('development'==process.env.NODE_ENV) {
      console.log(`NoReceiversDateRange().dateStart=>${noReceivers.dateStart}`);
      console.log(`NoReceiversDateRange().dateEnd=>${noReceivers.dateEnd}`);
    }


    var dateStart = noReceivers.dateStart; // DOES NOT WORK MUST NOT USE dateStart ?????? maybe 
    // because i typed noReceivers,dateStart instead of noReceivers.dateStart!!!
    var dtStart =Moment(new Date(noReceivers.dateStart)).format("MM-DD-YYYY HH:mm:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtStart=>${dtStart}`);
    }



    var dateEnd = noReceivers.dateEnd;
    var dtEnd =Moment(new Date(noReceivers.dateEnd)).format("MM-DD-YYYY HH:mm:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtEnd=>${dtEnd}`);
    }

    var dtStartFmt = dateFormat(new Date(noReceivers.dateStart), "mm-dd-yyyy HH:MM:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtStartFmt=>${dtStartFmt}`);
    }
    var dtEndFmt = dateFormat(new Date(noReceivers.dateEnd), "mm-dd-yyyy HH:MM:ss");
    if ('development'==process.env.NODE_ENV) {
      console.log(`dtEndFmt=>${dtEndFmt}`);
    }


    dispatch({ type:ACTION.SET_PROGRESS_BTN,progressBtn:PROGRESSBUTTON.LOADING });
    dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });
    client.render({
///S1S4DAv8e
        template: { shortid:"S1S4DAv8e"},
        data: { dtStart: dtStart,dtEnd:dtEnd}
    }, function(err, response) {
        var dirName1 = dirName;

        if ('development'==process.env.NODE_ENV) {
          console.log(`dirName: ${dirName}`);
          console.log(`dirName1: ${dirName1}`);
          console.log(`err =  `);
          console.dir(err);
        }

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
          dispatch({ type:ACTION.SET_NORECEIVERS_REPORT_DONE, done:true });
          if ('development'==process.env.NODE_ENV) {
            console.log(`Done creating file myfile.pdf `);
            console.log(`fileName: ${fileName}`);
          }
          ipcRenderer.send('asynchronous-message', fileName)
        });
    });
    var cnt=0;
    var maxCnt=15;
    while(!getState().Reports.noReceivers.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().Reports.noReceivers.failed || 
      !getState().Reports.noReceivers.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`NoReceiversReport not successful.`);
      }
      dispatch({ type:ACTION.SET_REASON, reason:`Network or server problem preventing access to the Report Server. `});
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SET_STATUS, status:'Can not connect to Report Server...' });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`NoReceiversReport Success.`);
      }
      dispatch({ type:ACTION.SET_STATE, state:STATE.SUCCESS});
    }
  }
}


