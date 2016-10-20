
var sql = require('mssql');
const {dialog} = require('electron').remote;
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as PROGRESSBUTTON from "../actions/ProgressButtonConst.js"

import * as CM from "./PORTSQLCM.js"
import * as M2M from "./PORTSQLM2M.js"
import * as CHECK1 from "./PORTSQLCheck1.js"
import * as CHECK2 from "./PORTSQLCheck2.js"
import * as CHECK3 from "./PORTSQLCheck3.js"
import * as UPDATE1 from "./PORTSQLUpdate1.js"
import * as UPDATE2 from "./PORTSQLUpdate2.js"
import * as UPDATE3 from "./PORTSQLUpdate3.js"
import * as CURRENTPO from "./PORTSQLCurrentPO.js"
import * as MISC from "./Misc.js"
import * as CONNECT from "./PORTSQLConst.js"

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
      dispatch({ type:PORTACTION.SET_REASON, reason:`primeDB(disp) Cannot Connection` });
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
/*    dispatch((dispatch,getState) => {
        var disp = dispatch;
        var getSt = getState;
        POReqTrans(disp,getSt);
      }
    );
*/  }
} // updateCheck1

export async function updateCheck2(disp,getSt,poNumber,vendorNumber,Address1,Address2,Address3,Address4,startPort) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 
  var cnt=0;

  dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });
  dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });

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

  if(!isPrimed()){
    // Exit if Not Primed
    continueProcess=false;
    return;
  }


  CM.portCribQueries(dispatch);
  M2M.portM2mQueries(dispatch);

  cnt=0;

  while(!CM.arePortQueriesDone() || !M2M.arePortQueriesDone())
  {
    if(++cnt>15 || CM.didPortQueriesFail() || M2M.didPortQueriesFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }


  if(continueProcess){
    if ('development'==process.env.NODE_ENV) {
      console.log(`Async Crib & M2m queries are complete.`);
    }

    CHECK1.portCheck1(dispatch)
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`Async Crib & M2m queries FAILED.`);
    }
  }

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
    CURRENTPO.sql1(dispatch,getState);
  }else{
    continueProcess=false;
  }

// Retrieve Current PO Number
  cnt=0;

  while(continueProcess && !CURRENTPO.isDone()){
    if(++cnt>15 || CURRENTPO.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueProcess && CURRENTPO.continuePORT()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`currentPO complete continue PORT process.`);
    }
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.SUCCESS });
  }
} // poUpdate




