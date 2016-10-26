
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
var contPORT=false;
var noPOReqs=false;
const ATTEMPTS=1;



export async function sql1(disp,getSt){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 
  if ('development'==process.env.NODE_ENV) {
    console.dir(state);
  }


  var cnt=0;
  init();
  execSQL1(dispatch,getState);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLSetPOMast.sql1() Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLSetPOMast.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLSetPOMast.sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLSetPOMast.sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLSetPOMast.sql1(): Suceeded`)
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

export function continuePORT(){
  if(true==contPORT)
  {
    return true;
  } else{
    return false;
  }
}

export function noPORequests(){
  if(true==noPOReqs)
  {
    return true;
  } else{
    return false;
  }
}


function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 

  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQLSetPOMast.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLSetPOMast.execSQL1() Connection Sucess`);
      }

      let statement;
      // SAME FOR PROD AND DEV
      if (MISC.PROD===true) {
        statement = `
        select * from btpomast
        `;
      }else{
        statement = `
        select * from btpomast
        `;
      }


      var request = new sql.Request(connection); 
      request.query(statement, function(err, recordset) {
        // ... error checks
        if(null==err){
          // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`PORTSQLSetPOMast.execSQL1().query Sucess`);
          }
          if(recordset.length!==0){
            if ('development'==process.env.NODE_ENV) {
              console.log("PORTSQLSetPOMast.execSQL1() had records.");
            }
            dispatch({ type:PORTACTION.SET_POMAST, poMast:recordset});
            contPORT=true;
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLSetPOMast.execSQL1(): No pomast records.` );
            }
            noPOReqs=true;
            dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.UPTODATE});
          }
          sql1Done=true;
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLSetPOMast.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLSetPOMast.execSQL1() err:  ${err.message}` );
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
          console.log(`PORTSQLSetPOMast.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLSetPOMast.Connection: ${err.message}` );
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
        console.log(`PORTSQLSetPOMast.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLSetPOMast.connection.on(error): ${err.message}` );
      }

      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}


