
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"


var sql1Done=false;
var sql1Cnt=0;
var sql1Failed=false;
var contPORT=false;
var noPOReqs=false;
var didStart=false;
const ATTEMPTS=1;



export async function sql1(disp,getSt,connection){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 
  var connect=connection;

  var cnt=0;
  init();
  didStart=true;
  execSQL1(dispatch,getState,connect);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLDelPOMastAndPOItemAndPOStatus.sql1() Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.sql1(): Suceeded`)
    }
  }

}

function init(){
  sql1Done=false;
  sql1Cnt=0;
  sql1Failed=false;
  contPORT=false;
  didStart=false;
}

export function started(){
  if(
    (true==didStart)
    )
  {
    return true;
  } else{
    return false;
  }
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
export function continuePORT(){
  if(true==contPORT)
  {
    return true;
  } else{
    return false;
  }
}


function execSQL1(disp,getSt,connect){
  var dispatch = disp;
  var getState = getSt;
  var state = getState();

  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.execSQL1() top=>${sql1Cnt}`);
  }

  var postart=state.POReqTrans.poMastRange.postart;
  var poend=state.POReqTrans.poMastRange.poend;

  var connection = new sql.Connection(connect, function(err) {
    // ... error checks
    if(null==err){
      let logId=state.POReqTrans.logId;

      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.execSQL1() Connection Sucess`);
        console.log(`postart=>${postart}`);
        console.log(`poend=>${poend}`);
        console.log(`logId=>${logId}`);
      }

      let sproc;

      if (MISC.PROD===true) {
        sproc = `bpDelPOMastAndPOItemAndPOStatus`;
      }else{
        sproc = `bpDevDelPOMastAndPOItemAndPOStatus`;
      }

      var request = new sql.Request(connection); 
      request.input('postart', sql.Char(6),postart);
      request.input('poend', sql.Char(6),poend);
      request.input('logId', sql.Int,logId);
      request.execute(sproc, function(err, recordsets, returnValue, affected) {
        // ... error checks
        if(null==err){
          if ('development'==process.env.NODE_ENV) {
            console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.execSQL1() Sucess`);
            console.log(affected); // number of rows affected by the statemens
/*            console.log(recordsets.length); // count of recordsets returned by the procedure
            console.log(recordsets[0].length); // count of rows contained in first recordset
            console.log(returnValue); // procedure return value
            console.log(recordsets.returnValue); // same as previous line
            console.log(affected); // number of rows affected by the statemens
            console.log(recordsets.rowsAffected); // same as previous line
            console.log(request.parameters.postart.value); // output value
            console.log(request.parameters.poend.value); // output value
*/          }
          sql1Done=true;
          contPORT=true;
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.execSQL1().request.execute():  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.execSQL1().request.execute():  ${err.message}` );
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
          console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.Connection: ${err.message}` );
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
        console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLDelPOMastAndPOItemAndPOStatus.connection.on(error): ${err.message}` );
      }
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}


