
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"

var prod=false;

var sql1Done=false;
var sql1Cnt=0;
var sql1Failed=false;
const ATTEMPTS=1;



export async function sql1(disp,getSt,vendorNumber,newM2mVendor){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 
  console.dir(state);

  var cnt=0;
  init();
  execSQL1(dispatch,vendorNumber,newM2mVendor);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLUpdate3.sql1() Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    console.log(`PORTSQLUpdate3.sql1(): Completed`)
  }else{
    console.log(`PORTSQLUpdate3.sql1(): Did NOT Complete`)
  }

  if(didFail()){
    console.log(`PORTSQLUpdate3.sql1(): Failed`)
  }else{
    console.log(`PORTSQLUpdate3.sql1(): Suceeded`)
  }

}

function init(){
  sql1Done=false;
  sql1Cnt=0;
  sql1Failed=false;
}

export function isDone(){
  if(
    (true==sql1Done)
    )
  {
    return true;
  } else{
    return false;
  }
}

export function didFail(){
  if(
    (true==sql1Failed)
    )
  {
    return true;
  } else{
    return false;
  }
}


function execSQL1(disp,vendorNumber,newM2mVendor){
  var dispatch = disp;
  console.log(`PORTSQLUpdate3.execSQL1() top=>${sql1Cnt}`);

  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      console.log(`PORTSQLUpdate3.execSQL1() Connection Sucess`);
      
      let procedure_name;

      if (prod===true) {
        procedure_name = `bpVendorUpdate`;
      }else{
        procedure_name = `bpDevVendorUpdate`;
      }


      var request = new sql.Request(connection); 
      request.input('vendorNumber', sql.VarChar(12), vendorNumber)
      request.input('newM2mVendor', sql.VarChar(6), newM2mVendor)
      request.execute(procedure_name, function(err, recordsets, returnValue) {
        // ... error checks
        if(null==err){
          // ... error checks
          console.log(`PORTSQLUpdate3.execSQL1() Sucess`);
         // console.dir(recordset);
          sql1Done=true;
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            console.log(`PORTSQLUpdate3.execSQL1().query:  ${err.message}` );
            console.log(`sql1Cnt = ${sql1Cnt}`);
          }else{
            console.log(`PORTSQLUpdate3.execSQL1() err:  ${err.message}` );
            dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
            dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
            sql1Failed=true;
          }
        }
      });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        console.log(`PORTSQLUpdate3.Connection: ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }else{
        console.log(`PORTSQLUpdate3.Connection: ${err.message}` );
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        sql1Failed=true;
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      console.log(`PORTSQLUpdate3.connection.on(error): ${err.message}` );
      console.log(`sql1Cnt = ${sql1Cnt}`);
    }else{
      console.log(`PORTSQLUpdate3.connection.on(error): ${err.message}` );
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}

