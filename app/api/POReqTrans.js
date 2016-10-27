
var sql = require('mssql');
const {dialog} = require('electron').remote;

import * as CHECK1 from "./PORTSQLCheck1.js"
import * as CHECK2 from "./PORTSQLCheck2.js"
import * as CHECK3 from "./PORTSQLCheck3.js"
import * as CM from "./PORTSQLCM.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"
import * as M2M from "./PORTSQLM2M.js"
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as PORTSQL from "./PORTSQL.js"
import * as PORTSQLINSPOMAST from "./PORTSQLInsPOMast.js"
import * as PORTSQLINSPOITEM from "./PORTSQLInsPOItem.js"
import * as PORTSQLSETPOCOUNT from "./PORTSQLSetPOCount.js"
import * as PORTSQLSETPOITEM from "./PORTSQLSetPOItem.js"
import * as PORTSQLSETPOMAST from "./PORTSQLSetPOMast.js"
import * as PORTSQLSETNEXTPO from "./PORTSQLSetNextPO.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PROGRESSBUTTON from "../actions/ProgressButtonConst.js"
import * as SETCURRENTPO from "./PORTSQLSetCurrentPO.js"
import * as UPDATE1 from "./PORTSQLUpdate1.js"
import * as UPDATE2 from "./PORTSQLUpdate2.js"
import * as UPDATE3 from "./PORTSQLUpdate3.js"

var prod=false;
var errors=false;
var primed=false;
var primeFailed=false;
var m2mConnectCnt=0;
var cribConnectCnt=0;

export async function primeDB(disp,stateUpdate){
  var dispatch=disp;
  var updateState=stateUpdate;
  var cnt=0;
  if ('development'==process.env.NODE_ENV) {
    console.log(`primeDB top`);
  }

  initPrime();
  // FIRST CONNECT ALWAYS FAILS IN DEVELOPER MODE
  cribConnect(dispatch,updateState);
  m2mConnect(dispatch,updateState);
  m2mConnect(dispatch,updateState);
  m2mConnect(dispatch,updateState);
  m2mConnect(dispatch,updateState);

  while(!isPrimed() && !primeFailed){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`primeDB(disp) Cannot Connect to Cribmaster or Made2Manage.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isPrimed()){
    dispatch({ type:PORTACTION.SET_PRIMED, primed:true });
    if(updateState){
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.PRIMED });
    }
  }else{
     dispatch({ type:PORTACTION.SET_STATUS, status:'Cannot connect to Cribmaster or Made2Manage....' });

  }

}

function initPrime(){
  primed=false;
  primeFailed=false;
  m2mConnectCnt=0;
  cribConnectCnt=0;
}

function isPrimed(){
  if(true==primed){
    return true;
  } else{
    return false;
  }
}

function cribConnect(disp,updateState){
  var dispatch=disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`cribConnectCnt = ${cribConnectCnt}`);
  }


  var cribConnection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.dir(cribConnection);
      }

      // Query

      var request = new sql.Request(cribConnection); // or: var request = connection1.request();
      request.query(
      `
        select * from po where ponumber = 25619
      `, function(err, recordset) {
          if(null==err){
            // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`crib query`);
            console.dir(recordset);
          }

            primed=true;
          }else{
            if(++cribConnectCnt<3) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`cribConnect.query:  ${err.message}` );
                console.log(`cribConnectCnt = ${cribConnectCnt}`);
              }

            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              primeFailed=true;
            }
          }
        }
      );
    }else{
      if(++cribConnectCnt<3) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`cribConnect.Connection:  ${err.message}` );
          console.log(`cribConnectCnt = ${cribConnectCnt}`);
        }

      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        primeFailed=true;
      }
    }
  });
  
  cribConnection.on('error', function(err) {
    if(++cribConnectCnt<3) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`cribConnect.on('error', function(err):  ${err.message}` );
        console.log(`cribConnectCnt = ${cribConnectCnt}`);
      }

    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      primeFailed=true;
    }
  });
}

function m2mConnect(disp,updateState){
  var dispatch=disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`m2mConnectCnt = ${m2mConnectCnt}`);
  }


  var m2mConnection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.dir(m2mConnection);
      }
      var request = new sql.Request(m2mConnection); 
      request.query(
        `
          select fvendno, fcompany
          FROM apvend 
          where fvendno = '002946'
        `,function(err, recordset) {
            // ... error checks
            if(null==err){
              if ('development'==process.env.NODE_ENV) {
                console.log(`m2mConnect: query success`);
                console.dir(recordset);
              }

              primed=true;
            }else{
              if(++m2mConnectCnt<3) {
                if ('development'==process.env.NODE_ENV) {
                  console.log(`m2mConnect.query:  ${err.message}` );
                  console.log(`m2mConnectCnt = ${m2mConnectCnt}`);
                }

              }else{
                dispatch({ type:PORTACTION.SET_REASON, state:err.message });
                dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
                primeFailed=true;
              }
            }
          }
      );
    }else{
      if(++m2mConnectCnt<3) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`m2mConnect.Connection:  ${err.message}` );
          console.log(`m2mConnectCnt = ${m2mConnectCnt}`);
        }
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        primeFailed=true;
      }

    }
  });
  
  m2mConnection.on('error', function(err) {
    if(++m2mConnectCnt<3) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`m2mConnect.on('error', function(err):  ${err.message}` );
        console.log(`m2mConnectCnt = ${m2mConnectCnt}`);
      }

    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      primeFailed=true;
    }
  });
}

export async function updateCheck1(disp,getSt,poNumber,item,poCategory,startPort) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 
  var cnt=0;


  dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });
  dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:PORTACTION.SET_STATUS, status:'' });

  if ('development'==process.env.NODE_ENV) {
    console.log(`updateCheck1(disp,getSt,poNumber,item,poCategory): top`);
    console.dir(portState);
    console.dir(startPort);
  }

  initPrime();
  primeDB(dispatch,false);

  while(!isPrimed() && !primeFailed){
    if(++cnt>15){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(!isPrimed()){
    // Exit if Not Primed
    dispatch({ type:PORTACTION.SET_STATUS, status:'' });

    return;
  }


  UPDATE1.sql1(dispatch,getState,poNumber,item,poCategory);

  cnt=0;

  while(!UPDATE1.isDone())
  {
    if(++cnt>15 || UPDATE1.didFail()){
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

  dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });
  dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:PORTACTION.SET_STATUS, status:'' });

  if ('development'==process.env.NODE_ENV) {
    console.log(`updateCheck2(): top`);
    console.dir(portState);
    console.dir(startPort);
  }


  var cnt=0;
  initPrime();
  primeDB(dispatch,false);

  while(!isPrimed() && !primeFailed){
    if(++cnt>15){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(!isPrimed()){
    // Exit if Not Primed
    return;
  }

  UPDATE2.sql1(dispatch,getState,poNumber,vendorNumber,Address1,Address2,Address3,Address4);

  cnt=0;

  while(!UPDATE2.isDone())
  {
    if(++cnt>15 || UPDATE2.didFail()){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(UPDATE2.isDone() && !UPDATE2.didFail()){
    startPort();
  }
} // updateCheck2

export async function updateCheck3(disp,getSt,vendorNumber,newM2mVendor,startPort) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 
  var cnt=0;

  dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });
  dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:PORTACTION.SET_STATUS, status:'' });

  if ('development'==process.env.NODE_ENV) {
    console.log(`updateCheck3(): top`);
    console.dir(portState);
    console.dir(startPort);
  }

  cnt=0;
  initPrime();
  primeDB(dispatch,false);

  while(!isPrimed() && !primeFailed){
    if(++cnt>15){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(!isPrimed()){
    // Exit if Not Primed
    return;
  }

  UPDATE3.sql1(dispatch,getState,vendorNumber,newM2mVendor);

  cnt=0;

  while(!UPDATE3.isDone())
  {
    if(++cnt>15 || UPDATE3.didFail()){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(UPDATE3.isDone() && !UPDATE3.didFail()){
    startPort(false);
  }
} // updateCheck3


export default async function POReqTrans(disp,getSt,prime) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 

  var continueProcess=true;

  if(PORTSTATE.STARTED != portState.POReqTrans.state){
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });
    dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });

  }

  dispatch({ type:PORTACTION.SET_STATUS, status:'' });
//    dispatch({ type:PORTACTION.SET_STATUS, status:'Started PO Request Transfer process...' });


  var cnt=0;
  if(prime){
    initPrime();
    primeDB(dispatch,false);
  }


  if ('development'==process.env.NODE_ENV) {
    console.dir(portState);
  }


  while(!isPrimed() && !primeFailed){
    if(++cnt>15){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isPrimed()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`primeDB Success continue PO Request Transfer.`);
    }
    PORTSQLSETPOCOUNT.sql1(dispatch,getState);
  }else{
    continueProcess=false;
    if ('development'==process.env.NODE_ENV) {
      console.log(`primeDB FAILED quit PO Request Transfer.`);
    }
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
    if(PORTSQLSETPOCOUNT.didFail()){
      if ('development'==process.env.NODE_ENV) {
        console.log(`setPOCount FAILED stop PORT process.`);
      }
      
    }else if(PORTSQLSETPOCOUNT.noPORequests()) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`setPOCount there are no POs to transfer stop PORT process.`);
      }
      dispatch({ type:PORTACTION.SET_STATUS, status:'There are no POs to transfer...' });
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
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.SUCCESS });

//    PORTSQLINSPOITEM.sql1(dispatch,getState);
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
return;
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
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.SUCCESS });
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLINSPOITEM.sql1() FAILED stop PORT process.`);
    }
    continueProcess=false;
  }

  return;

} // poUpdate




