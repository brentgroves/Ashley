
var sql = require('mssql');
const {dialog} = require('electron').remote;

import * as CONNECT from "../SQLConst.js"
import * as GRACTION from "../../actions/GRConst.js"
import * as GRSTATE from "../../actions/GRState.js"
import * as MISC from "../Misc.js"
import * as PROGRESSBUTTON from "../../actions/ProgressButtonConst.js"
import * as SQLPRIMEDB from "../SQLPrimeDB.js"
import * as SQLRCITEMINSERT from "./SQLRCItemInsert.js"
import * as SQLRCMASTINSERT from "./SQLRCMastInsert.js"
import * as SQLSETCURRENTRECEIVER from "./SQLSetCurrentReceiver.js"
import * as SQLSETRCMAST from "./SQLSetRCMast.js"
import * as SQLSETRECEIVERCOUNT from "./SQLSetReceiverCount.js"
import * as SQLSETSHIPVIA from "./SQLSetShipVia.js"


export async function prime(disp,getSt){
  var dispatch = disp;
  var getState = getSt; 
  var cnt=0;
  var maxCnt=10;

  if ('development'==process.env.NODE_ENV) {
    console.log(`prime() top.`);
  }

  dispatch({ type:GRACTION.INIT});

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
    continueProcess=false;
    dispatch({ type:GRACTION.SET_REASON, reason:`primeDB FAILED Stop Gen Receivers process. ` });
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
      continueProcess=false;
    }
   
  }

  // THE END
  if(continueProcess){
    dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.SUCCESS });
  }

}


export async function start(disp,getSt,prime) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;
  var isFirstPass=false;

  // will already be started if called by Update functions.
  if(GRSTATE.STARTED != getState().GenReceivers.state){
    dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.STARTED });
    dispatch({ type:GRACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
    isFirstPass=true;
  }

  dispatch({ type:GRACTION.SET_STATUS, status:'' });
//    dispatch({ type:GR.SET_STATUS, status:'Started PO Request Transfer process...' });


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
        console.log(`primeDB FAILED Stop Gen Receivers process.`);
      }
      continueProcess=false;
      dispatch({ type:GRACTION.SET_REASON, reason:`primeDB FAILED Stop Gen Receivers process. ` });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.SET_STATUS, status:'Can not connect to Made2Manage or Cribmaster...' });
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`prime Success continue Gen Receivers process.`);
      }
    }
  }

 // DONE WITH FIRSTPASS PROCESSING AT THIS POINT
  if(continueProcess){
    SQLSETRECEIVERCOUNT.sql1(dispatch,getState);
  }

  cnt=0;
  maxCnt=10;
  while(continueProcess && !SQLSETRECEIVERCOUNT.isDone()){
    if(++cnt>maxCnt || SQLSETRECEIVERCOUNT.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }


  if(continueProcess&&SQLSETRECEIVERCOUNT.continueGR()){
    if(getState().GenReceivers.receiverCount>0){
      SQLSETCURRENTRECEIVER.sql1(dispatch,getState);
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSETRECEIVERCOUNT count =0.`);
      }
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.UPTODATE });
      continueProcess=false;
    }
  }

  cnt=0;
  maxCnt=10;
  while(continueProcess && !SQLSETCURRENTRECEIVER.isDone()){
    if(++cnt>maxCnt || SQLSETCURRENTRECEIVER.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }


  if(continueProcess&&SQLSETCURRENTRECEIVER.continueGR()){
    SQLSETSHIPVIA.sql1(dispatch,getState);
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSETCURRENTRECEIVER not successful or did not run.`);
    }
    continueProcess=false;
  }

  cnt=0;
  maxCnt=10;
  while(continueProcess && !SQLSETSHIPVIA.isDone()){
    if(++cnt>maxCnt || SQLSETSHIPVIA.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }


  if(continueProcess&&SQLSETSHIPVIA.continueGR()){
    SQLSETRCMAST.sql1(dispatch,getState);
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSETSHIPVIA not successful or did not run.`);
    }
    continueProcess=false;
  }

  cnt=0;
  maxCnt=10;
  while(continueProcess && !SQLSETRCMAST.isDone()){
    if(++cnt>maxCnt || SQLSETRCMAST.didFail()){
      continueProcess=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }


  if(continueProcess&&SQLSETRCMAST.continueGR()){
    dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.RCMAST_INSERT_NOT_READY });
//   RCMAST_INSERT dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.SUCCESS });
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSETRCMAST not successful or did not run.`);
    }
    continueProcess=false;
  }

  return;

} // poUpdate




