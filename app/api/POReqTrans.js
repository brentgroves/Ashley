
var sql = require('mssql');
const {dialog} = require('electron').remote;

import * as CHECK1 from "./PORTSQLCheck1.js"
import * as CHECK2 from "./PORTSQLCheck2.js"
import * as CHECK3 from "./PORTSQLCheck3.js"
import * as CM from "./PORTSQLCM.js"
import * as COMMON from "../actions/CommonConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"
import * as M2M from "./PORTSQLM2M.js"
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as PORTSQL from "./PORTSQL.js"
import * as PORTSQLEXEC from "./PORTSQLExec.js"
import * as PORTSQLINSLOG from "./PORTSQLInsLog.js"
import * as PORTSQLINSPOMAST from "./PORTSQLInsPOMast.js"
import * as PORTSQLINSPOITEM from "./PORTSQLInsPOItem.js"
import * as PORTSQLDELPOMASTANDPOITEM from "./PORTSQLDelPOMastAndPOItem.js"
import * as PORTSQLDELPOMASTANDPOITEMANDPOSTATUS from "./PORTSQLDelPOMastAndPOItemAndPOStatus.js"
import * as PORTSQLSETPOCOUNT from "./PORTSQLSetPOCount.js"
import * as PORTSQLSETPOITEM from "./PORTSQLSetPOItem.js"
import * as PORTSQLSETPOMAST from "./PORTSQLSetPOMast.js"
import * as PORTSQLSETPOMASTRANGE from "./PORTSQLSetPOMastRange.js"
import * as PORTSQLSETNEXTPO from "./PORTSQLSetNextPO.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PROGRESSBUTTON from "../actions/ProgressButtonConst.js"
import * as SETCURRENTPO from "./PORTSQLSetCurrentPO.js"

import * as SQLPRIMEDB from "./SQLPrimeDB.js"
import * as UPDATE1 from "./PORTSQLUpdate1.js"
import * as UPDATE2 from "./PORTSQLUpdate2.js"
import * as UPDATE3 from "./PORTSQLUpdate3.js"

export async function primePORT(disp,getSt){
  var dispatch = disp;
  var getState = getSt; 
  var cnt=0;
  var maxCnt=10;

  if ('development'==process.env.NODE_ENV) {
    console.log(`primePORT() top.`);
  }

  dispatch({ type:PORTACTION.INIT_PORT});

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
      console.log(`primePORT FAILED Stop PO Request Transfer.`);
    }
    dispatch({ type:PORTACTION.SET_REASON, reason:`primePORT FAILED Stop PO Request Transfer.` });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
    dispatch({ type:PORTACTION.SET_STATUS, status:'Can not connect to Made2Manage or Cribmaster...' });
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`primePORT Success continue PO Request Transfer.`);
    }
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.PRIMED });
  }
}

export async function updateCheck1(disp,getSt,poNumber,item,poCategory,startPort) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 
  var cnt=0;
  var maxCnt=10;
  var continueProcess=true;



  dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });
  dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:PORTACTION.SET_STATUS, status:'' });

  if ('development'==process.env.NODE_ENV) {
    console.log(`updateCheck1(disp,getSt,poNumber,item,poCategory): top`);
  }

//  initPrime();
//  primeDB(dispatch,false);
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
      console.log(`primeDB FAILED Stop PO Request Transfer.`);
    }
    dispatch({ type:PORTACTION.SET_REASON, reason:`primeDB FAILED Stop PO Request Transfer.` });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
    dispatch({ type:PORTACTION.SET_STATUS, status:'Can not connect to Made2Manage or Cribmaster...' });
    continueProcess=false;
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`primeDB Success continue PO Request Transfer.`);
    }
    UPDATE1.sql1(dispatch,getState,poNumber,item,poCategory);
  }


  /////////////////////////////

  cnt=0;
  maxCnt=15;
  while(continueProcess&&!UPDATE1.isDone())
  {
    if(++cnt>maxCnt || UPDATE1.didFail()){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(UPDATE1.isDone() && !UPDATE1.didFail()){
    startPort(false);
  }
} // updateCheck1

export async function updateCheck2(disp,getSt,poNumber,vendorNumber,Address1,Address2,Address3,Address4,startPort) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 
  var cnt=0;
  var maxCnt=10;
  var continueProcess=true;

  dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });
  dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:PORTACTION.SET_STATUS, status:'' });

  if ('development'==process.env.NODE_ENV) {
    console.log(`updateCheck2(): top`);
  }

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
      console.log(`primeDB FAILED Stop PO Request Transfer.`);
    }
    dispatch({ type:PORTACTION.SET_REASON, reason:`primeDB FAILED Stop PO Request Transfer.` });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
    dispatch({ type:PORTACTION.SET_STATUS, status:'Can not connect to Made2Manage or Cribmaster...' });
    continueProcess=false;
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`primeDB Success continue PO Request Transfer.`);
    }
    UPDATE2.sql1(dispatch,getState,poNumber,item,poCategory);
  }

  /////////////////////////////

  cnt=0;
  maxCnt=15;

  while(continueProcess&&!UPDATE2.isDone())
  {
    if(++cnt>maxCnt || UPDATE2.didFail()){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(UPDATE2.isDone() && !UPDATE2.didFail()){
    startPort(false);
  }
} // updateCheck2

export async function updateCheck3(disp,getSt,vendorNumber,newM2mVendor,startPort) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 
  var cnt=0;
  var maxCnt=10;
  var continueProcess=true;

  dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });
  dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:PORTACTION.SET_STATUS, status:'' });

  if ('development'==process.env.NODE_ENV) {
    console.log(`updateCheck3(): top`);
  }

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
      console.log(`primeDB FAILED Stop PO Request Transfer.`);
    }
    dispatch({ type:PORTACTION.SET_REASON, reason:`primeDB FAILED Stop PO Request Transfer.` });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
    dispatch({ type:PORTACTION.SET_STATUS, status:'Can not connect to Made2Manage or Cribmaster...' });
    continueProcess=false;
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`primeDB Success continue PO Request Transfer.`);
    }
    UPDATE3.sql1(dispatch,getState,poNumber,item,poCategory);
  }

////////////////////////////
  cnt=0;
  maxCnt=15;

  while(continueProcess&&!UPDATE3.isDone())
  {
    if(++cnt>maxCnt || UPDATE3.didFail()){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(UPDATE3.isDone() && !UPDATE3.didFail()){
    startPort(false);
  }
} // updateCheck3


export async function POReqTrans(disp,getSt,prime) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 
  var continueProcess=true;
  var isFirstPass=false;

  // will already be started if called by Update functions.
  if(PORTSTATE.STARTED != portState.POReqTrans.state){
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });
    dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
    isFirstPass=true;
  }

  dispatch({ type:PORTACTION.SET_STATUS, status:'' });
//    dispatch({ type:PORTACTION.SET_STATUS, status:'Started PO Request Transfer process...' });


  var maxCnt=10;
  var cnt=0;

  if(prime){
    //SQLPRIMEDB.sql1(dispatch,getState);
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
        console.log(`primeDB FAILED Stop PO Request Transfer.`);
      }
      continueProcess=false;
      dispatch({ type:PORTACTION.SET_REASON, reason:`primeDB FAILED Stop PO Request Transfer. ` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      dispatch({ type:PORTACTION.SET_STATUS, status:'Can not connect to Made2Manage or Cribmaster...' });
    }
  }

  // CHECK FOR PREVIOUSLY FAILED SESSIONS
  if(continueProcess&&isFirstPass){
    PORTSQLINSLOG.sql1(dispatch,getState);
    cnt=0;
    while(continueProcess && !PORTSQLINSLOG.isDone()){
      if(++cnt>15 || PORTSQLINSLOG.didFail()){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }
    if(continueProcess && PORTSQLINSLOG.continuePORT()){
      PORTSQLSETPOMASTRANGE.sql1(dispatch,getState);
    }else{
      continueProcess=false;
    }

    cnt=0;
    while(continueProcess && !PORTSQLSETPOMASTRANGE.isDone()){
      if(++cnt>15 || PORTSQLSETPOMASTRANGE.didFail()){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }


    if(continueProcess && PORTSQLSETPOMASTRANGE.continuePORT()){
      let poMastRange=getState().POReqTrans.poMastRange;
      let poMastCount=(poMastRange.poend-poMastRange.postart+1);
      if ('development'==process.env.NODE_ENV) {
        console.log(`setPOMastRange complete continue PORT process.`);
        console.log(`poMastRange.postart=>${poMastRange.postart}`); 
        console.log(`poMastRange.poend=>${poMastRange.poend}`); 
      }
      if(0==poMastRange.poend){
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_5_PASS});
        dispatch({ type:PORTACTION.SET_CHECK0, chk0:PORTCHK.SUCCESS });
        if ('development'==process.env.NODE_ENV) {
          console.log(`Previous SESSION Succeded No ROLLBACK necessary.`);
        }
        // Sanity check on how many po(s) are being deleted
      }else if((0<poMastCount)&&(250>poMastCount)){
        // FAILED SESSION DETECTED DO ROLLBACK
        if ('development'==process.env.NODE_ENV) {
          console.log(`Previous SESSION Failed ROLLBACK Started.`);
        }
        PORTSQLDELPOMASTANDPOITEM.sql1(dispatch,getState,CONNECT.m2mDefTO);
        cnt=0;
        while(continueProcess && !PORTSQLDELPOMASTANDPOITEM.isDone()){
          if(++cnt>15 || PORTSQLDELPOMASTANDPOITEM.didFail()){
            continueProcess=false;
            break;
          }else{
            await MISC.sleep(2000);
          }
        }
        if(continueProcess && PORTSQLDELPOMASTANDPOITEM.continuePORT()){
          if ('development'==process.env.NODE_ENV) {
            console.log(`DELPOMASTANDPOITEM M2M complete continue PORT process.`);
          }
          PORTSQLDELPOMASTANDPOITEM.sql1(dispatch,getState,CONNECT.cribDefTO);
        }else{
          if ('development'==process.env.NODE_ENV) {
            console.log(`DELPOMASTANDPOITEM M2M FAILED stop PORT process.`);
          }
          continueProcess=false;
        }

        cnt=0;
        while(continueProcess && !PORTSQLDELPOMASTANDPOITEM.isDone()){
          if(++cnt>15 || PORTSQLDELPOMASTANDPOITEM.didFail()){
            continueProcess=false;
            break;
          }else{
            await MISC.sleep(2000);
          }
        }
        if(continueProcess && PORTSQLDELPOMASTANDPOITEM.continuePORT()){
          if ('development'==process.env.NODE_ENV) {
            console.log(`DELPOMASTANDPOITEM Crib complete continue PORT process.`);
          }
          let logId=getState().POReqTrans.logId;
          let sql=`
            update [dbo].[btPORTLog]
            set fRollBack=1,
            fRBPOMastStart=${poMastRange.postart},
            fRBPOMastEnd=${poMastRange.poend},
            fStart=GETDATE()
            where id=${logId}
          `;
          PORTSQLEXEC.sql1(dispatch,getState,sql);

        }else{
          if ('development'==process.env.NODE_ENV) {
            console.log(`ROLLBACK Crib FAILED stop PORT process.`);
          }
          continueProcess=false;
        }

        cnt=0;
        while(continueProcess && !PORTSQLEXEC.isDone()){
          if(++cnt>15 || PORTSQLEXEC.didFail()){
            continueProcess=false;
            break;
          }else{
            await MISC.sleep(2000);
          }
        }
        if(continueProcess && PORTSQLEXEC.continuePORT()){
          // we are done with firstPass processing
        }else{
          if ('development'==process.env.NODE_ENV) {
            console.log(`btPORTLog update FAILED stop PORT process.`);
          }

          continueProcess=false;
        }



      }else{
        dispatch({ type:PORTACTION.SET_STATUS, status:`RollBack FAILED: POMast count is out of range!` });
        dispatch({ type:PORTACTION.SET_REASON, reason:`RollBack FAILED: POMast count is out of range. Inform IT immediately!` });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        dispatch({ type:PORTACTION.SET_CHECK0, chk0:PORTCHK.FAIL });
        continueProcess=false;
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`setPOMastRange FAILED stop PORT process.`);
      }
      continueProcess=false;
    }
  }
  // DEBUG
 // dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.SUCCESS });
 // return;

 // DONE WITH FIRSTPASS PROCESSING AT THIS POINT
  if(continueProcess){
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_5_PASS});
    dispatch({ type:PORTACTION.SET_CHECK0, chk0:PORTCHK.SUCCESS });
    PORTSQLSETPOCOUNT.sql1(dispatch,getState);
  }

  cnt=0;
  while(continueProcess && !PORTSQLSETPOCOUNT.isDone()){
    if(++cnt>15 || PORTSQLSETPOCOUNT.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && PORTSQLSETPOCOUNT.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`setPOCount complete continue PORT process.`);
    }
    CM.sql1(dispatch,getState);
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`setPOCount FAILED stop PORT process.`);
    }
    continueProcess=false;
  }

  cnt=0;

  while(continueProcess&&!CM.isDone())
  {
    if(++cnt>15 || CM.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  continueProcess=false;
  dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.SUCCESS });
//STARTHERE
  if(continueProcess && CM.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`CM.sql1() complete continue process.`);
    }
//    M2M.sql1(dispatch,getState);
    CHECK1.portCheck1(dispatch)
  }else{
    continueProcess=false;
    if ('development'==process.env.NODE_ENV) {
      console.log(`CM.sql1() timed out or FAILED DONT continue process.`);
    }
  }
/*
   cnt=0;

  while(continueProcess && !M2M.isDone())
  {
    if(++cnt>15 || M2M.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && M2M.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`M2M.sql1() complete continue process.`);
    }
    CHECK1.portCheck1(dispatch)
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`M2m.sql1() timed out or FAILED DONT continue process.`);
    }
  }
*/
// CHECK#1
  cnt=0;

  while(continueProcess && !CHECK1.isPortCheck1Done()){
    if(++cnt>15 || CHECK1.didCheckFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && CHECK1.continueChecks()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`portCheck1 complete continue Checks.`);
    }
    CHECK2.portCheck2(dispatch)
  }else{
    continueProcess=false;
    if ('development'==process.env.NODE_ENV) {
      console.log(`portCheck1 FAILED stop Checks.`);
    }
  }

// CHECK#2
  cnt=0;

  while(continueProcess && !CHECK2.isPortCheck2Done()){
    if(++cnt>15 || CHECK2.didCheckFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }


  if(continueProcess && CHECK2.continueChecks()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`portCheck2 complete continue Checks.`);
    }
    CHECK3.portCheck(dispatch,getState)
  }else{
    continueProcess=false;
    if ('development'==process.env.NODE_ENV) {
      console.log(`portCheck2 FAILED stop Checks.`);
    }
  }


// CHECK#3
  cnt=0;

  while(continueProcess && !CHECK3.isPortCheckDone()){
    if(++cnt>15 || CHECK3.didCheckFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && CHECK3.continueChecks()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`portCheck3 complete continue Checks.`);
    }
    SETCURRENTPO.sql1(dispatch,getState);
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`portCheck3 FAILED stop Checks.`);
    }
    continueProcess=false;
  }

 cnt=0;

  while(continueProcess && !SETCURRENTPO.isDone()){
    if(++cnt>15 || SETCURRENTPO.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && SETCURRENTPO.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`setCurrentPO complete continue PORT process.`);
    }
    PORTSQLSETPOCOUNT.sql1(dispatch,getState);
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`setCurrentPO FAILED stop PORT process.`);
    }
    continueProcess=false;
  }


  cnt=0;

  while(continueProcess && !PORTSQLSETPOCOUNT.isDone()){
    if(++cnt>15 || PORTSQLSETPOCOUNT.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && PORTSQLSETPOCOUNT.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`setPOCount complete continue PORT process.`);
    }
    // DO THIS BEFORE WRITING THE PO RECORDS!!!
    // IF THE PO RECORD WRITES FAIL THERE MAY BE A GAP
    // IN THE PO NUMBERS BUT IF WE WRITE THE PO RECORDS
    // AND THE CURRENTPO IS NOT UPDATED THE SAME PO(S) WILL 
    // BE ASSIGNED TO THE NEXT PO(S) GENERATED.
    PORTSQLSETNEXTPO.sql1(dispatch,getState);
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`setPOCount FAILED stop PORT process.`);
    }
    continueProcess=false;
  }

  cnt=0;

  while(continueProcess && !PORTSQLSETNEXTPO.isDone()){
    if(++cnt>15 ||  PORTSQLSETNEXTPO.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess &&  PORTSQLSETNEXTPO.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`setNextPO complete continue PORT process.`);
    }
    PORTSQL.sql1(dispatch,getState);

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`setNextPO FAILED stop PORT process.`);
    }
    continueProcess=false;
  }

  cnt=0;

  while(continueProcess && !PORTSQL.isDone()){
    if(++cnt>15 || PORTSQL.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && PORTSQL.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQL complete continu PORT process.`);
    }
    PORTSQLSETPOMAST.sql1(dispatch,getState);
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQL FAILED stop PORT process.`);
    }
    continueProcess=false;
  }

// Set poMast 
  cnt=0;

  while(continueProcess && !PORTSQLSETPOMAST.isDone()){
    if(++cnt>15 || PORTSQLSETPOMAST.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && PORTSQLSETPOMAST.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLSETPOMAST complete continue PORT process.`);
    }
    PORTSQLINSPOMAST.sql1(dispatch,getState);
  }else{
    if(PORTSQLSETPOMAST.didFail()){
      if ('development'==process.env.NODE_ENV) {
        console.log(`setPOMast FAILED stop PORT process.`);
      }
    }else if(PORTSQLSETPOMAST.noPORequests()) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`setPOMast there are no POs to transfer. Stop PORT process.`);
      }
      dispatch({ type:PORTACTION.SET_STATUS, status:'There are no POs to transfer...' });
    }
    continueProcess=false;
  }

// Insert into pomast 
  cnt=0;

  while(continueProcess && !PORTSQLINSPOMAST.isDone()){
    if(++cnt>15 || PORTSQLINSPOMAST.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && PORTSQLINSPOMAST.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLINSPOMAST complete continue PORT process.`);
    }
    PORTSQLSETPOITEM.sql1(dispatch,getState);
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLINSPOMAST.sql1() FAILED stop PORT process.`);
    }
    continueProcess=false;
  }
// Set poItem
  cnt=0;

  while(continueProcess && !PORTSQLSETPOITEM.isDone()){
    if(++cnt>15 || PORTSQLSETPOITEM.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && PORTSQLSETPOITEM.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLSETPOITEM complete continue PORT process.`);
    }
    PORTSQLINSPOITEM.sql1(dispatch,getState);
  }else{
    if(PORTSQLSETPOITEM.didFail()){
      if ('development'==process.env.NODE_ENV) {
        console.log(`setPOItem FAILED stop PORT process.`);
      }
    }else if(PORTSQLSETPOITEM.noPORequests()) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`setPOItem there are no POs to transfer. Stop PORT process.`);
      }
      dispatch({ type:PORTACTION.SET_STATUS, status:'There are no POs to transfer...' });
    }
    continueProcess=false;
  }

// Insert into poitem 
  cnt=0;

  while(continueProcess && !PORTSQLINSPOITEM.isDone()){
    if(++cnt>15 || PORTSQLINSPOITEM.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && PORTSQLINSPOITEM.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLINSPOITEM complete continue PORT process.`);
    }
    PORTSQLSETPOMASTRANGE.sql1(dispatch,getState);
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLINSPOITEM.sql1() FAILED stop PORT process.`);
    }
    continueProcess=false;
  }


  // START CRIB POMAST / POITEM DELETIONS
  cnt=0;
  while(continueProcess && !PORTSQLSETPOMASTRANGE.isDone()){
    if(++cnt>15 || PORTSQLSETPOMASTRANGE.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }



  if(continueProcess && PORTSQLSETPOMASTRANGE.continuePORT()){
    let poMastRange=getState().POReqTrans.poMastRange;
    let logId=getState().POReqTrans.logId;
    if ('development'==process.env.NODE_ENV) {
      console.log(`setPOMastRange complete continue PORT process.`);
      console.log(`poMastRange.postart=>${poMastRange.postart}`); 
      console.log(`poMastRange.poend=>${poMastRange.poend}`); 
    }

    let sql=`
      update [dbo].[btPORTLog]
      set fPOMastStart=${poMastRange.postart},
      fPOMastEnd=${poMastRange.poend}
      where id=${logId}
    `;
    PORTSQLEXEC.sql1(dispatch,getState,sql);

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`setSetPOMastRange FAILED stop PORT process.`);
    }
    continueProcess=false;
  }

  cnt=0;
  while(continueProcess && !PORTSQLEXEC.isDone()){
    if(++cnt>15 || PORTSQLEXEC.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && PORTSQLEXEC.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLEXEC update Log complete continue PORT process.`);
    }
    let poMastRange=getState().POReqTrans.poMastRange;
    let poMastCount=(poMastRange.poend-poMastRange.postart+1);

    // Sanity check on how many po(s) are being deleted
    if((0<poMastCount)&&(250>poMastCount)){
      PORTSQLDELPOMASTANDPOITEMANDPOSTATUS.sql1(dispatch,getState,CONNECT.cribDefTO);
    }else{
      dispatch({ type:PORTACTION.SET_STATUS, status:`DEL POMAST AND POITEM And update POSTATUSNO FAILED: POMast count is out of range!` });
      dispatch({ type:PORTACTION.SET_REASON, reason:`DELPOMASTANDPOITEMANDPOSTATUS FAILED: POMast count is out of range. Inform IT immediately!` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      dispatch({ type:PORTACTION.SET_CHECK4, chk4:PORTCHK.FAILURE });
      continueProcess=false;
    }
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLEXEC update Log FAILED stop PORT process.`);
    }
    continueProcess=false;
  }


  cnt=0;
  while(continueProcess && !PORTSQLDELPOMASTANDPOITEMANDPOSTATUS.isDone()){
    if(++cnt>15 || PORTSQLDELPOMASTANDPOITEMANDPOSTATUS.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }
  if(continueProcess && PORTSQLDELPOMASTANDPOITEMANDPOSTATUS.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLDELPOMASTANDPOITEMANDPOSTATUS M2M complete done with PORT process.`);
    }
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_60_PASS });
    dispatch({ type:PORTACTION.SET_CHECK4, chk4:PORTCHK.SUCCESS });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.SUCCESS });

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLDELPOMASTANDPOITEMANDPOSTATUS M2M FAILED stop PORT process.`);
    }
    continueProcess=false;
  }



  return;

} // poUpdate




