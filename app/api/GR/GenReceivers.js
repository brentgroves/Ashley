
var sql = require('mssql');

import { remote,ipcRenderer } from 'electron';



import * as CHK from "../../actions/ChkConst.js"
import * as CONNECT from "../SQLConst.js"
import * as GRACTION from "../../actions/GRConst.js"
import * as GRLIMITS from "../../actions/GRLimits.js"
import * as GRSTATE from "../../actions/GRState.js"
import * as GRSTEPS from "../../actions/GRSteps.js"
import * as MISC from "../Misc.js"
import * as PROGRESSBUTTON from "../../actions/ProgressButtonConst.js"
import * as SQLPOSTATUSUPDATE from "./SQLPOStatusUpdate.js"
import * as SQLEXEC from "./SQLExec.js"
import * as SQLFINISH from "./SQLFinish.js"
import * as SQLLOGENTRYLASTSET from "./SQLLogEntryLastSet.js"
import * as SQLLOGINSERT from "./SQLLogInsert.js"
import * as SQLLOGSTEPSET from "./SQLLogStepSet.js"
import * as SQLGENRECEIVERS from "./SQLGenReceivers.js"
import * as SQLPRIMEDB from "../SQLPrimeDB.js"
import * as SQLRCITEMDELETE from "./SQLRCItemDelete.js"
import * as SQLRCITEMINSERT from "./SQLRCItemInsert.js"
import * as SQLRCITEMUPDATE from "./SQLRCItemUpdate.js"
import * as SQLRCMASTDELETE from "./SQLRCMastDelete.js"
import * as SQLRCMASTINSERT from "./SQLRCMastInsert.js"
import * as SQLRECEIVERSCRIBDELETE from "./SQLReceiversCribDelete.js"
import * as SQLSETCURRENTRECEIVER from "./SQLSetCurrentReceiver.js"
import * as SQLSETRECEIVERCOUNT from "./SQLSetReceiverCount.js"
import * as SQLSETSHIPVIA from "./SQLSetShipVia.js"
import * as SQLTRANSDELETE from "./SQLTransDelete.js"
import * as SQLTRANSINSERT from "./SQLTransInsert.js"

//import * as hashLeftOuterJoin from "lodash-joins/lib/hash/hashLeftOuterJoin.js"
var _ = require('lodash');
var joins = require('lodash-joins');
var sorty    = require('sorty')
var fs = require('fs');
var client = require("jsreport-client")('http://10.1.1.217:5488', 'admin', 'password')


export async function prime(disp,getSt){
  var dispatch = disp;
  var getState = getSt; 
  var cnt=0;
  var maxCnt=10;

  if ('development'==process.env.NODE_ENV) {
    console.log(`prime() top.`);
  }

  dispatch({ type:GRACTION.INIT});
  dispatch({ type:GRACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });

  dispatch((dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    SQLPRIMEDB.sql1(disp,getSt);
  });

  cnt=0;
  while(!getState().Common.primed){
    if(++cnt>maxCnt ){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }
  dispatch({ type:GRACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.READY });

  if(!getState().Common.primed){
    if ('development'==process.env.NODE_ENV) {
      console.log(`prime FAILED Stop PO Request Transfer.`);
    }
    dispatch({ type:GRACTION.SET_REASON, reason:`prime FAILED Stop Gen Receivers process.` });
    dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
    dispatch({ type:GRACTION.SET_STATUS, status:'Can not connect to Made2Manage or Cribmaster...' });
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`prime Success continue Gen Receivers process.`);
    }
    dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.PRIMED });
  }
}


export async function m2mGenReceivers(disp,getSt) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;

  var maxCnt=10;
  var cnt=0;
  if ('development'==process.env.NODE_ENV) {
    console.log(`m2mGenReceivers()->top.`);
  }
  dispatch({ type:GRACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.GENERATE_RECEIVERS });

  dispatch((dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    SQLPRIMEDB.sql1(disp,getSt);
  });

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
    dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
    continueProcess=false;
    dispatch({ type:GRACTION.SET_REASON, reason:`primeDB FAILED. ` });
    dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
    dispatch({ type:GRACTION.SET_STATUS, status:'Can not connect to Made2Manage or Cribmaster...' });
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`prime Success.`);
    }
  }



  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLLOGSTEPSET.sql1(disp,getSt,GRSTEPS.STEP_20_RECEIVER_INSERT_M2M);
    });

    cnt=0;
    while(!getState().GenReceivers.bpGRLogStepSet.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }
    if(getState().GenReceivers.bpGRLogStepSet.failed ||
      !getState().GenReceivers.bpGRLogStepSet.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLLOGSTEPSET.sql1() FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
      continueProcess=false;
    }
  }


  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLRCMASTINSERT.sql1(disp,getSt);
    });

    cnt=0;
    while(!getState().GenReceivers.rcmastInsert.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }
    if(getState().GenReceivers.rcmastInsert.failed ||
      !getState().GenReceivers.rcmastInsert.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCMASTINSERT.sql1() FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
      continueProcess=false;
    }
  }


  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLRCITEMINSERT.sql1(disp,getSt);
    });
    cnt=0;
    while(!getState().GenReceivers.rcitemInsert.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.rcitemInsert.failed || 
      !getState().GenReceivers.rcmastInsert.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCITEMINSERT.sql1() FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
      continueProcess=false;
    }
  }

  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLRCITEMUPDATE.sql1(disp,getSt);
    });
    cnt=0;
    while(!getState().GenReceivers.rcitemUpdate.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.rcitemUpdate.failed || 
      !getState().GenReceivers.rcitemUpdate.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCITEMUPDATE.sql1() FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
      continueProcess=false;
    }
   
  }


  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLLOGSTEPSET.sql1(disp,getSt,GRSTEPS.STEP_30_PO_STATUS_UPDATE);
    });

    cnt=0;
    while(!getState().GenReceivers.bpGRLogStepSet.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }
    if(getState().GenReceivers.bpGRLogStepSet.failed ||
      !getState().GenReceivers.bpGRLogStepSet.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLLOGSTEPSET.sql1() FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
      continueProcess=false;
    }
  }



  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLPOSTATUSUPDATE.sql1(disp,getSt,false);
    });
    cnt=0;
    while(!getState().GenReceivers.bpGRPOStatusUpdate.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.bpGRPOStatusUpdate.failed || 
      !getState().GenReceivers.bpGRPOStatusUpdate.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLPOSTATUSUPDATE.sql1() FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
      continueProcess=false;
    }
   
  }

  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLTRANSINSERT.sql1(disp,getSt,false);
    });
    cnt=0;
    while(!getState().GenReceivers.bpGRTransInsert.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.bpGRTransInsert.failed || 
      !getState().GenReceivers.bpGRTransInsert.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLTRANSINSERT.sql1() FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
      continueProcess=false;
    }
   
  }


//  dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.SUCCESS });
//  continueProcess=false;



  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLFINISH.sql1(disp,getSt,true,GRSTEPS.STEP_40_FINISH);
    });
    cnt=0;
    while(!getState().GenReceivers.bpGRFinish.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.bpGRFinish.failed || 
      !getState().GenReceivers.bpGRFinish.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLFINISH.sql1() FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
      continueProcess=false;
    }
   
  }

  if(continueProcess){
    dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.SUCCESS });
    dispatch((dispatch,getState) => {
        var disp = dispatch;
        var getSt = getState;
        POStatusReport(disp,getSt);
      }
    );    

    cnt=0;
    while(!getState().GenReceivers.poStatusReport.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.poStatusReport.failed || 
      !getState().GenReceivers.poStatusReport.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`m2mGenReceivers().poStatusReport() FAILED.`);
      }
    }
  }


//  dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.SUCCESS });
//  continueProcess=false;

  // THE END
  if(continueProcess){
    dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.SUCCESS });
  }

}

export async function rollBack(disp,getSt,rcvCnt) {
  var dispatch=disp;
  var getState=getSt;
  var rcvCount=rcvCnt;
  if ('development'==process.env.NODE_ENV) {
    console.log(`rollback ==> top.`);
  }

  dispatch({ type:GRACTION.ROLLBACK_DONE, done:false });
  dispatch({ type:GRACTION.ROLLBACK_FAILED, failed:false });

  var continueProcess=true;

  if(0!=rcvCount){
    var cnt=0;
    var maxCnt=10;
    var step = getState().GenReceivers.logEntryLast.fStep;
    switch(step){
      // never should have STEP_0_START,STEP_3_UP_TO_DATE because rcvCount would be 0
      // if STEP_5_ROLLBACK then SQLFINISH should have already updated 
      // fStep and fEnd because they get updated by the same sql statement.
      // if STEP_40_FINISH the same logic applies as for the STEP_5_ROLLBACK state.
      // These states are only for included for completeness
      case GRSTEPS.STEP_0_START:
      case GRSTEPS.STEP_3_UP_TO_DATE:
      case GRSTEPS.STEP_5_ROLLBACK:
      case GRSTEPS.STEP_8_OUT_OF_RANGE:
      case GRSTEPS.STEP_40_FINISH:
        // nothing to do
        break;
      case GRSTEPS.STEP_10_GEN_RECEIVERS:
      case GRSTEPS.STEP_20_RECEIVER_INSERT_M2M:
      case GRSTEPS.STEP_30_PO_STATUS_UPDATE:
        dispatch((dispatch,getState) => {
          var disp = dispatch;
          var getSt = getState;
          SQLRECEIVERSCRIBDELETE.sql1(disp,getSt);
        });
        cnt=0;
        maxCnt=10;
        while(!getState().GenReceivers.bpGRReceiversCribDelete.done){
          if(++cnt>maxCnt ){
            break;
          }else{
            await MISC.sleep(2000);
          }
        }

        if(getState().GenReceivers.bpGRReceiversCribDelete.failed || 
          !getState().GenReceivers.bpGRReceiversCribDelete.done){
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLRECEIVERSCRIBDELETE.sql1() FAILED.`);
          }
          continueProcess=false;
        }else{
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLRECEIVERSCRIBDELETE.sql1() Success.`);
          }
        }
        if(continueProcess && 
          ( (GRSTEPS.STEP_20_RECEIVER_INSERT_M2M==step) ||
            (GRSTEPS.STEP_30_PO_STATUS_UPDATE==step)
          )){
          dispatch((dispatch,getState) => {
            var disp = dispatch;
            var getSt = getState;
            SQLRCITEMDELETE.sql1(disp,getSt);
          });
          cnt=0;
          maxCnt=10;
          while(!getState().GenReceivers.bpGRRCItemDelete.done){
            if(++cnt>maxCnt ){
              break;
            }else{
              await MISC.sleep(2000);
            }
          }

          if(getState().GenReceivers.bpGRRCItemDelete.failed || 
            !getState().GenReceivers.bpGRRCItemDelete.done){
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLRCITEMDELETE.sql1() FAILED.`);
            }
            continueProcess=false;
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLRCITEMDELETE.sql1() Success.`);
            }
          }
        }
        if(continueProcess && (GRSTEPS.STEP_30_PO_STATUS_UPDATE==step)){
          dispatch((dispatch,getState) => {
            var disp = dispatch;
            var getSt = getState;
            SQLPOSTATUSUPDATE.sql1(disp,getSt,true);
          });
          maxCnt=10;
          cnt=0;
          while(!getState().GenReceivers.bpGRPOStatusUpdate.done){
            if(++cnt>maxCnt ){
              break;
            }else{
              await MISC.sleep(2000);
            }
          }

          if(getState().GenReceivers.bpGRPOStatusUpdate.failed || 
            !getState().GenReceivers.bpGRPOStatusUpdate.done){
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLPOSTATUSUPDATE.sql1() FAILED.`);
            }
            continueProcess=false;
          }

          if(continueProcess){
            dispatch((dispatch,getState) => {
              var disp = dispatch;
              var getSt = getState;
              SQLTRANSDELETE.sql1(disp,getSt,false);
            });
            maxCnt=10;
            cnt=0;
            while(!getState().GenReceivers.bpGRTransDelete.done){
              if(++cnt>maxCnt ){
                break;
              }else{
                await MISC.sleep(2000);
              }
            }

            if(getState().GenReceivers.bpGRTransDelete.failed || 
              !getState().GenReceivers.bpGRTransDelete.done){
              if ('development'==process.env.NODE_ENV) {
                console.log(`SQLTRANSDELETE.sql1() FAILED.`);
              }
              continueProcess=false;
            }
           
          }


        }
        if(continueProcess && 
          ( (GRSTEPS.STEP_20_RECEIVER_INSERT_M2M==step) ||
            (GRSTEPS.STEP_30_PO_STATUS_UPDATE==step)
          )){
          dispatch((dispatch,getState) => {
            var disp = dispatch;
            var getSt = getState;
            SQLRCMASTDELETE.sql1(disp,getSt);
          });
          cnt=0;
          maxCnt=10;
          while(!getState().GenReceivers.bpGRRCMastDelete.done){
            if(++cnt>maxCnt ){
              break;
            }else{
              await MISC.sleep(2000);
            }
          }

          if(getState().GenReceivers.bpGRRCMastDelete.failed || 
            !getState().GenReceivers.bpGRRCMastDelete.done){
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLRCMASTDELETE.sql1() FAILED.`);
            }
            continueProcess=false;
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLRCMASTDELETE.sql1() Success.`);
            }
          }
        }
        break;
    }
  }

  if(continueProcess){
      dispatch((dispatch,getState) => {
        var disp = dispatch;
        var getSt = getState;
        SQLFINISH.sql1(disp,getSt,false,GRSTEPS.STEP_5_ROLLBACK);
      });
      cnt=0;
      maxCnt=10;
      while(!getState().GenReceivers.bpGRFinish.done){
        if(++cnt>maxCnt ){
          break;
        }else{
          await MISC.sleep(2000);
        }
      }

      if(getState().GenReceivers.bpGRFinish.failed || 
        !getState().GenReceivers.bpGRFinish.done){
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLFINISH.sql1() FAILED.`);
        }
        continueProcess=false;
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLFINISH.sql1() Success.`);
        }
      }

  }

  if(!continueProcess){
    dispatch({ type:GRACTION.ROLLBACK_FAILED, failed:true });
  }

  dispatch({ type:GRACTION.ROLLBACK_DONE, done:true });


}
/* TESTING
Question
1) Does Nancys receivers need to be a part of the inventory movement report
-- No but they do need to get into the received goods report
-- The received goods uses rcmast/rcitem so they should be ok

steps
1. receive items  - rcmast,rcitem,po
2. if raw parts the inventory movement happens
3. these trans are recorded in the intran table

Links: http://colintoh.com/blog/lodash-10-javascript-utility-functions-stop-rewriting

*/


export async function start(disp,getSt) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;

  dispatch({ type:GRACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.STARTED });
  dispatch({ type:GRACTION.SET_STATUS, status:'' });

  dispatch((dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    SQLPRIMEDB.sql1(disp,getSt);
  });
  
  var maxCnt=10;
  var cnt=0;
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
    dispatch({ type:GRACTION.SET_REASON, reason:`primeDB FAILED. ` });
    dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
    dispatch({ type:GRACTION.SET_STATUS, status:'Can not connect to Made2Manage or Cribmaster...' });
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`prime Success.`);
    }
  }

 // debug/testing section
 //http://colintoh.com/blog/lodash-10-javascript-utility-functions-stop-rewriting 
  if(continueProcess){
    dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.SUCCESS });
    dispatch((dispatch,getState) => {
        var disp = dispatch;
        var getSt = getState;
        POStatusReport(disp,getSt);
      }
    );    

    cnt=0;
    while(!getState().GenReceivers.poStatusReport.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.poStatusReport.failed || 
      !getState().GenReceivers.poStatusReport.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`m2mGenReceivers().poStatusReport() FAILED.`);
      }
    }
  }
  continueProcess=false;

  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLLOGENTRYLASTSET.sql1(disp,getSt);
    });
    cnt=0;
    maxCnt=10;
    while(!getState().GenReceivers.bpGRGetLogEntryLast.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.bpGRGetLogEntryLast.failed || 
      !getState().GenReceivers.bpGRGetLogEntryLast.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLLOGENTRYLASTSET.sql1() FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK0, chk0:CHK.FAILURE });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLLOGENTRYLASTSET.sql1() Success.`);
      }
    }
  }

  var fEnd = getState().GenReceivers.logEntryLast.fEnd;
  if ('development'==process.env.NODE_ENV) {
    console.log(`fEnd = ${fEnd}.`);
  }

  if(continueProcess && (null == fEnd)){
    var rcvStart=0;
    var rcvEnd=0;
    var receiverCount=0;
    var failedBeforeReceiverCnt=false;

    rcvStart=getState().GenReceivers.logEntryLast.rcvStart;
    rcvEnd=getState().GenReceivers.logEntryLast.rcvEnd;

    if ('development'==process.env.NODE_ENV) {
      console.log(`rcvStart = ${rcvStart}.`);
      console.log(`rcvEnd = ${rcvEnd}.`);
    }


    // Did the previous session fail before retrieving the receiver count?
    if((null != rcvStart) &&
       (null != rcvEnd)){
      receiverCount=rcvEnd-rcvStart+1;
    }else{
      failedBeforeReceiverCnt=true;
    }
    if ('development'==process.env.NODE_ENV) {
      console.log(`receiverCount = ${receiverCount}.`);
      console.log(`failedBeforeReceiverCnt = ${failedBeforeReceiverCnt}.`);
    }
    // if receiverCount==0 still call rollback
    // either we got the receiver count before the last session failed
    // or we did not get the receiver count no matter which case
    // the rollback will set fEnd and not update the lastRun.
    if(receiverCount>=0 &&
       receiverCount<=GRLIMITS.MAX_RECEIVERS){
      dispatch((dispatch,getState) => {
        var disp = dispatch;
        var getSt = getState;
        rollBack(disp,getSt,receiverCount);
      });
      cnt=0;
      maxCnt=10;
      while(!getState().GenReceivers.rollback.done){
        if(++cnt>maxCnt ){
          break;
        }else{
          await MISC.sleep(2000);
        }
      }

      if(getState().GenReceivers.rollback.failed || 
        !getState().GenReceivers.rollback.done){
        if ('development'==process.env.NODE_ENV) {
          console.log(`rollBack() FAILED.`);
        }
        dispatch({ type:GRACTION.SET_CHECK0, chk0:CHK.FAILURE });
        continueProcess=false;
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`rollBack() Success.`);
        }
      }
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`rollback receiver count >= MAX_RECEIVERS.`);
      }
      dispatch({ type:GRACTION.SET_CHECK1, chk1:CHK.FAILURE });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.OUT_OF_RANGE });
      continueProcess=false;
    }

  }


  if(continueProcess){
    dispatch({ type:GRACTION.SET_CHECK0, chk0:CHK.SUCCESS });
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLLOGINSERT.sql1(disp,getSt);
    });
    cnt=0;
    maxCnt=10;
    while(!getState().GenReceivers.logInsert.done){
      if(++cnt>maxCnt ){
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.logInsert.failed || 
      !getState().GenReceivers.logInsert.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLLOGINSERT.sql1() FAILED.`);
      }
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLLOGINSERT.sql1() Success.`);
      }
    }
  }



  if(continueProcess ){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLSETRECEIVERCOUNT.sql1(dispatch,getState,CONNECT.cribDefTO);
    });

    cnt=0;
    maxCnt=10;
    while(!getState().GenReceivers.bpGRReceiverCount.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.bpGRReceiverCount.failed || 
      !getState().GenReceivers.bpGRReceiverCount.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSETRECEIVERCOUNT.sql1() FAILED.`);
      }
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSETRECEIVERCOUNT.sql1() Success.`);
      }
    }
  }



  // if the program fails at this point some receivers numbers will be
  // skipped for good because the rollback function can really do nothing for this case
  var finish=false;
  var logStep;
  var lastRun;
  if(continueProcess ){
    if(getState().GenReceivers.receiverCount>0 &&
       getState().GenReceivers.receiverCount<=GRLIMITS.MAX_RECEIVERS){
      dispatch((dispatch,getState) => {
        var disp = dispatch;
        var getSt = getState;
        dispatch({ type:GRACTION.SET_CHECK1, chk1:CHK.SUCCESS });
        SQLSETCURRENTRECEIVER.sql1(dispatch,getState);
      });
    }else if(0==getState().GenReceivers.receiverCount){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCMASTRANGE count =0.`);
      }
      dispatch({ type:GRACTION.SET_CHECK1, chk1:CHK.SUCCESS });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.UPTODATE });
      continueProcess=false;
      logStep=GRSTEPS.STEP_3_UP_TO_DATE
      lastRun=true;
      finish=true;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCMASTRANGE count >= MAX_RECEIVERS.`);
      }
      dispatch({ type:GRACTION.SET_CHECK1, chk1:CHK.FAILURE });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.OUT_OF_RANGE });
      continueProcess=false;
      logStep=GRSTEPS.STEP_8_OUT_OF_RANGE 
      lastRun=false;
      finish=true;
    }

    // terminate log entry correctly for uptodate or outofrange states
    if(finish){
      // continueProcess is set to false already
      dispatch((dispatch,getState) => {
        var disp = dispatch;
        var getSt = getState;
        SQLFINISH.sql1(disp,getSt,false,logStep);
      });
      cnt=0;
      maxCnt=10;
      while(!getState().GenReceivers.bpGRFinish.done){
        if(++cnt>maxCnt ){
          break;
        }else{
          await MISC.sleep(2000);
        }
      }

      if(getState().GenReceivers.bpGRFinish.failed || 
        !getState().GenReceivers.bpGRFinish.done){
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLFINISH.sql1() FAILED.`);
        }
        dispatch({ type:GRACTION.SET_CHECK1, chk1:CHK.FAILURE });
        continueProcess=false;  // not needed - continueProcess already false;
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLFINISH.sql1() Success.`);
        }
      }
    }



    if(continueProcess){
      dispatch({ type:GRACTION.SET_CHECK1, chk1:CHK.SUCCESS });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.PREPARING_RECEIVERS });
      cnt=0;
      maxCnt=10;
      while(!getState().GenReceivers.bpGRSetCurrentReceiver.done){
        if(++cnt>maxCnt){
          continueProcess=false;
          break;
        }else{
          await MISC.sleep(2000);
        }
      }

      if(getState().GenReceivers.bpGRSetCurrentReceiver.failed || 
        !getState().GenReceivers.bpGRSetCurrentReceiver.done){
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLSETCURRENTRECEIVER.sql1() FAILED.`);
        }
        dispatch({ type:GRACTION.SET_CHECK2, chk2:CHK.FAILURE });
        continueProcess=false;
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLSETCURRENTRECEIVER.sql1() Success.`);
        }
      }
    }
  }




  if(continueProcess){
    let rcmastRange={};
    rcmastRange.start=parseInt(getState().GenReceivers.currentReceiver);
    rcmastRange.end=rcmastRange.start+getState().GenReceivers.receiverCount-1;
    dispatch({ type:GRACTION.SET_RCMAST_RANGE, rcmastRange:rcmastRange});
    let logId=getState().GenReceivers.logId;

    let sqlStatement = `
      update btGRLog
      set rcvStart = ${rcmastRange.start}
      ,rcvEnd = ${rcmastRange.end}
      where id = ${logId};    
    `

    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLEXEC.sql1(dispatch,getState,CONNECT.cribDefTO,sqlStatement);
    });

   //   SQLSETSHIPVIA.sql1(dispatch,getState);

    cnt=0;
    maxCnt=10;
    while(!getState().GenReceivers.sqlExec.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.sqlExec.failed || 
      !getState().GenReceivers.sqlExec.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLEXEC.sql1() update btGRLog set rcvStart FAILED.`);
      }
      dispatch({ type:GRACTION.SET_CHECK2, chk2:CHK.FAILURE });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLEXEC.sql1() update btGRLog set rcvStart Success.`);
      }
    }
  }


  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLSETSHIPVIA.sql1(dispatch,getState);
    });

    cnt=0;
    maxCnt=10;
    while(!getState().GenReceivers.shipViaQry.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.shipViaQry.failed || 
      !getState().GenReceivers.shipViaQry.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSETSHIPVIA not successful.`);
      }
      dispatch({ type:GRACTION.SET_CHECK2, chk2:CHK.FAILURE });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSETSHIPVIA Success.`);
      }
    }

  }

  if(continueProcess){
    dispatch((dispatch,getState) => {
      var disp = dispatch;
      var getSt = getState;
      SQLGENRECEIVERS.sql1(dispatch,getState);
    });

    while(!getState().GenReceivers.bpGRGenReceivers.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.bpGRGenReceivers.failed || 
      !getState().GenReceivers.bpGRGenReceivers.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLGENRECEIVERS not successful.`);
      }
      dispatch({ type:GRACTION.SET_CHECK2, chk2:CHK.FAILURE });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLGENRECEIVERS Success.`);
      }
    }
  }


  // debug/testing section
 //http://colintoh.com/blog/lodash-10-javascript-utility-functions-stop-rewriting 
 /*
  if(continueProcess){

    var st = getState();

    var rcmast = st.GenReceivers.rcmast;
    var rcitem = st.GenReceivers.rcitem;

    var rcmastSel = _.map(rcmast).map(function(x){
      return _.pick(x, ['freceiver', 'fpono','fpacklist','ffrtcarr']); 
    });

    var rcvJoin =joins.hashLeftOuterJoin(rcmastSel, accessor, rcitem, accessor);

    dispatch({ type:GRACTION.SET_RCVJOIN,rcvJoin:rcvJoin});

    if ('development'==process.env.NODE_ENV) {
      console.log(`rcvJoin =>`);
      console.dir(rcvJoin);

    }

  }
*/

//  dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.SUCCESS });
//  continueProcess=false;

  if(continueProcess){
    dispatch({ type:GRACTION.SET_CHECK2, chk2:CHK.SUCCESS });
    dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.NOT_READY_TO_REVIEW });
  }

  return;

} // start



export function RcvJoin(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;

  var st = getState();

  dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.PRE_REVIEW_RECEIVERS });

  var rcmast = st.GenReceivers.rcmast;
  var rcitem = st.GenReceivers.rcitem;

  var rcmSelect = _.map(rcmast).map(function(x){

    var rcmPick = _.pick(x, ['freceiver', 'fpono','fpacklist','fcompany','ffrtcarr']); 

    return rcmPick; 
  });

  var rcvJoin =joins.hashLeftOuterJoin(rcmSelect, accessor, rcitem, accessor);

  var rcvMod = _.map(rcvJoin).map(function(x){
    var poRecv=x.fpono+' / '+x.freceiver; 
    var totCost=parseFloat(x.fqtyrecv)  * parseFloat(x.fucost);
    totCost=totCost.toFixed(2)
    var rcmAdd = _.assign(x, {'poRecv':poRecv},{'totCost':totCost},{'sumRow':false});
    if ('development'==process.env.NODE_ENV) {
      console.log(`fqtyrecv = ${x.fqtyrecv} `);
      console.log(`fucost = ${x.fucost} `);
      console.log(`totCost = ${totCost} `);
      console.log(`poRecv = ${poRecv} `);
      console.log(`rcmAdd = `);
      console.dir(rcmAdd);
    }

    return rcmAdd; 
  });

  var sortInfo = [ { name: 'fpono', dir: 'asc'},{ name: 'freceiver', dir: 'asc'},{ name: 'fpartno', dir: 'asc'}];

  var rcvSorted = sorty(sortInfo, rcvMod);
  if ('development'==process.env.NODE_ENV) {
    console.log(`rcvJoin = `);
    console.dir(rcvSorted);
  }

  var rcvRunningTotalCost=[];
  var sumRecv='start';
  var sumRecvTot=0;
  var sumPORecv,sumPO,sumRecv,sumPackList,sumFrtCarr;
  _.map(rcvSorted).map(function(x){
    if((x.freceiver!=sumRecv)&&('start'!=sumRecv)){
      sumRecvTot=parseFloat(sumRecvTot).toFixed(2);
      var rcvSum = {'poRecv':sumPORecv,'fpono':sumPO,'fpartno':'999','freceiver':sumRecv,'fpacklist':sumPackList, 
      'ffrtcarr':sumFrtCarr,'fqtyrecv':999,'fucost':999.9,'totCost':sumRecvTot,'sumRow':true};



      if ('development'==process.env.NODE_ENV) {
        console.log(`if((x.freceiver!=curRecv)&&('start'!=curRecv)) =>rcvSum = `);
        console.dir(rcvSum);
      }

      rcvRunningTotalCost.push(rcvSum);

      sumPORecv=x.poRecv;
      sumPO=x.fpono;
      sumRecv=x.freceiver;
      sumPackList=x.fpacklist;
      sumFrtCarr=x.ffrtcarr;
      sumRecvTot=0;
 
    }else if((x.freceiver!=sumRecv)&&'start'==sumRecv){
      sumPORecv=x.poRecv;
      sumPO=x.fpono;
      sumRecv=x.freceiver;
      sumPackList=x.fpacklist;
      sumFrtCarr=x.ffrtcarr;
      sumRecvTot=0;

      if ('development'==process.env.NODE_ENV) {
        console.log(`if((x.freceiver!=curRecv)&&('start'==curRecv)) =>x = `);
        console.dir(x);
      }

    }

    sumRecvTot=parseFloat(sumRecvTot)+parseFloat(x.totCost); 
    if ('development'==process.env.NODE_ENV) {
        console.log(`sumPORecv = ${sumPORecv}`);
        console.log(`sumPO = ${sumPO}`);
        console.log(`sumRecv = ${sumRecv}`);
        console.log(`sumPackList = ${sumPackList}`);
        console.log(`sumFrtCarr = ${sumFrtCarr}`);
        console.log(`sumRecvTot = ${sumRecvTot}`);
        console.log(`x = `);
        console.dir(x);
    }
    rcvRunningTotalCost.push(x);
  });

  if ('development'==process.env.NODE_ENV) {
    console.log(`rcvRunningTotalCost =`);
    console.dir(rcvRunningTotalCost);
  }


  dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.REVIEW_RECEIVERS });
  dispatch({ type:GRACTION.SET_RCVJOIN,rcvJoin:rcvRunningTotalCost});

  if ('development'==process.env.NODE_ENV) {
    console.log(`rcvJoin =>`);
    console.dir(rcvJoin);

  }

}


function accessor(obj) {
 return obj['freceiver'];
}

export async function POStatusReport(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;


  //remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
  dispatch({ type:GRACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.DISPLAY_REPORT });

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
          dispatch({ type:GRACTION.SET_POSTATUS_REPORT_DONE, done:true });
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
    while(!getState().GenReceivers.poStatusReport.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().GenReceivers.poStatusReport.failed || 
      !getState().GenReceivers.poStatusReport.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`POStatusReport not successful.`);
      }
      /*  Don't fail the APP if the report fails.
      dispatch({ type:GRACTION.SET_REASON, reason:`FAILED to generate report.` });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.SET_STATUS, status:'Can not connect to Report Server...' });
      */
//      dispatch({ type:GRACTION.SET_CHECK3, chk3:CHK.FAILURE });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`POStatusReport Success.`);
      }
    }
  }

}
