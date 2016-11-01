
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



export async function sql1(disp,getSt,poNumber,item,poCategory){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 
  if ('development'==process.env.NODE_ENV) {
    console.dir(state);
  }


  var cnt=0;
  init();
  execSQL1(dispatch,poNumber,item,poCategory);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLUpdate1.sql1(disp,getSt,poNumber,item,poCategory) Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLUpdate1.sql1(disp,getSt,poNumber,item,poCategory): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLUpdate1.sql1(disp,getSt,poNumber,item,poCategory): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLUpdate1.sql1(disp,getSt,poNumber,item,poCategory): Failed`)
    }
  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLUpdate1.sql1(disp,getSt,poNumber,item,poCategory): Suceeded`)
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


function execSQL1(disp,poNumber,item,poCategory){
  var dispatch=disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQLUpdate1.execSQL1(poNumber,item,poCategory) top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLUpdate1.execSQL1(poNumber,item,poCategory) Connection Sucess`);
      }

      
      let statement;
      if (MISC.prod===true) {
        statement = `
          update PODETAIL
          set UDF_POCATEGORY = ${poCategory}
          where 
          PONumber = ${poNumber} and Item = ${item}
        `;
      }else{
        statement = `
          update btPODETAIL
          set UDF_POCATEGORY = ${poCategory}
          where 
          PONumber = ${poNumber} and Item = ${item}
        `;
      }


      var request = new sql.Request(connection); 
      request.query(
      statement, function(err, recordset) {
        if(null==err){
          // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`PORTSQLUpdate1.execSQL1(poNumber,item,poCategory) Sucess`);
          }

         // console.dir(recordset);
          sql1Done=true;
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLUpdate1.execSQL1(poNumber,item,poCategory).query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }

          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLUpdate1.execSQL1(poNumber,item,poCategory) err:  ${err.message}` );
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
          console.log(`PORTSQLUpdate1.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLUpdate1.Connection: ${err.message}` );
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
        console.log(`PORTSQLUpdate1.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLUpdate1.connection.on(error): ${err.message}` );
      }
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}


