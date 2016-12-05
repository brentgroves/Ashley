var sql = require('mssql');
import * as GRACTION from "../../actions/GRConst.js"
import * as GRSTATE from "../../actions/GRState.js"
import * as CONNECT from "../SQLConst.js"
import * as MISC from "../Misc.js"


var sql1Cnt=0;
const ATTEMPTS=1;



export async function sql1(disp,getSt){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLRCMastDelete()->top.`);
  }


  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState);

}


function init(dispatch){
  sql1Cnt=0;
  dispatch({ type:GRACTION.RCMAST_DELETE_FAILED, failed:false });
  dispatch({ type:GRACTION.RCMAST_DELETE_DONE, done:false });
}


function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;

  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLRCMastDelete.execSQL1() top=>${sql1Cnt}`);
  }

  var connection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCMastDelete.execSQL1() Connection Sucess`);
      }
      let sproc;

      if (MISC.PROD===true) {
        sproc = `bpGRRCMastDelete`;
      }else{
        sproc = `bpGRRCMastDeleteDev`;
      }

      var rcvStart = getState().GenReceivers.logEntryLast.rcvStart;
      var rcvEnd = getState().GenReceivers.logEntryLast.rcvEnd;

      var request = new sql.Request(connection); 
      request.input('rcvStart', sql.Char(6), rcvStart);
      request.input('rcvEnd', sql.Char(6), rcvEnd);
      request.execute(sproc, function(err, recordsets, returnValue) {
        // ... error checks
        if(null==err){
          // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLRCMastDelete.execSQL1() Sucess`);
          }
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLRCMastDelete.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLRCMastDelete.execSQL1():  ${err.message}` );
            }
            dispatch({ type:GRACTION.SET_REASON, reason:err.message });
            dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
            dispatch({ type:GRACTION.RCMAST_DELETE_FAILED, failed:true });
          }
        }
      });
      dispatch({ type:GRACTION.RCMAST_DELETE_DONE, done:true });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLRCMastDelete.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLRCMastDelete.Connection: ${err.message}` );
        }

        dispatch({ type:GRACTION.SET_REASON, reason:err.message });
        dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
        dispatch({ type:GRACTION.RCMAST_DELETE_FAILED, failed:true });
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCMastDelete.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCMastDelete.connection.on(error): ${err.message}` );
      }

      dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.RCMAST_DELETE_FAILED, failed:true });
    }
  });
}


