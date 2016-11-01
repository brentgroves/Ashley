
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"

var sql1Done=false;
var sql1Cnt=0;
var sql1Failed=false;
const ATTEMPTS=1;



export async function sql1(disp,getSt,poNumber,vendorNumber,Address1,Address2,Address3,Address4){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 
  if ('development'==process.env.NODE_ENV) {
    console.dir(state);
  }


  var cnt=0;
  init();
  execSQL1(dispatch,poNumber,vendorNumber,Address1,Address2,Address3,Address4);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLUpdate2.sql1() Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLUpdate2.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLUpdate2.sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLUpdate2.sql1(): Failed`)
    }
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLUpdate2.sql1(): Suceeded`)
    }
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


function execSQL1(disp,poNumber,vendorNumber,Address1,Address2,Address3,Address4){
  var dispatch = disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQLUpdate2.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLUpdate2.execSQL1(poNumber,vendorNumber) Connection Sucess`);
      }

      
      let procedure_name;
      if (MISC.PROD===true) {
        procedure_name = `bpPOVendorUpdate`;
      }else{
        procedure_name = `bpDevPOVendorUpdate`;
      }

      var request = new sql.Request(connection); 
      request.input('poNumber', sql.Int, poNumber);
      request.input('vendor', sql.VarChar(12), vendorNumber);
      request.input('Address1', sql.VarChar(50), Address1);
      request.input('Address2', sql.VarChar(50), Address2);
      request.input('Address3', sql.VarChar(50), Address3);
      request.input('Address4', sql.VarChar(50), Address4);
      request.execute(procedure_name, function(err, recordsets, returnValue) {
        // ... error checks
        if(null==err){
          // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`PORTSQLUpdate2.execSQL1() =>${poNumber},${vendorNumber},${Address1},${Address2},${Address3},${Address4}`);
            console.log(`PORTSQLUpdate2.execSQL1() Sucess`);
          }
         // console.dir(recordset);
          sql1Done=true;
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLUpdate2.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }

          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLUpdate2.execSQL1() err:  ${err.message}` );
            }
            dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
            dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
            sql1Failed=true;
          }
        }
      });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLUpdate2.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }

      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLUpdate2.Connection: ${err.message}` );
        }

        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        sql1Failed=true;
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLUpdate2.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLUpdate2.connection.on(error): ${err.message}` );
      }

      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}


