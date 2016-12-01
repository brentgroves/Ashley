var sql = require('mssql');
import * as GRACTION from "../../actions/GRConst.js"
import * as GRSTATE from "../../actions/GRState.js"
import * as CONNECT from "../SQLConst.js"
import * as MISC from "../Misc.js"


var sql1Cnt=0;
const ATTEMPTS=1;


// tested 11-29
export async function sql1(disp,getSt){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLLogEntryLastSet()->top.`);
  }


  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState);

}

function init(dispatch){
  sql1Cnt=0;
  dispatch({ type:GRACTION.LOG_ENTRY_LAST_FAILED, failed:false });
  dispatch({ type:GRACTION.LOG_ENTRY_LAST_DONE, done:false });
}


function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;

  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLLogEntryLastSet.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLLogEntryLastSet.execSQL1() Connection Sucess`);
      }

      let sproc;

      if (MISC.PROD===true) {
        sproc = `bpGRGetLogEntryLast`;
      }else{
        // not using a separate dev log
        sproc = `bpGRGetLogEntryLast`;
      }

      var request = new sql.Request(connection); 

      request.output('id', sql.Int);
      request.output('fStart', sql.DateTime);
      request.output('fStep', sql.VarChar(50));
      request.output('rcvStart', sql.Char(6));
      request.output('rcvEnd', sql.Char(6));
      request.output('fEnd', sql.DateTime);
      request.execute(sproc, function(err, recordsets, returnValue, affected) {
        // ... error checks
        if(null==err){
          // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLLogEntryLastSet.execSQL1() Sucess`);
          }
          let logId = request.parameters.id.value;
          let fStart = request.parameters.fStart.value;
          let fStep = request.parameters.fStep.value;
          let rcvStart = request.parameters.rcvStart.value;
          let rcvEnd = request.parameters.rcvEnd.value;
          let fEnd = request.parameters.fEnd.value;
          let logEntryLast = {
            logId:logId,
            fStart:fStart,
            fStep:fStep,
            rcvStart:rcvStart,
            rcvEnd:rcvEnd,
            fEnd:fEnd
          }
          dispatch({ type:GRACTION.SET_LOG_ENTRY_LAST, logEntryLast:logEntryLast });
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLLogEntryLastSet.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLLogEntryLastSet.execSQL1():  ${err.message}` );
            }
            dispatch({ type:GRACTION.SET_REASON, reason:err.message });
            dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
            dispatch({ type:GRACTION.LOG_ENTRY_LAST_FAILED, failed:true });
          }
        }
      });
      dispatch({ type:GRACTION.LOG_ENTRY_LAST_DONE, done:true });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLLogEntryLastSet.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLLogEntryLastSet.Connection: ${err.message}` );
        }

        dispatch({ type:GRACTION.SET_REASON, reason:err.message });
        dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
        dispatch({ type:GRACTION.LOG_ENTRY_LAST_FAILED, failed:true });
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLLogEntryLastSet.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLLogEntryLastSet.connection.on(error): ${err.message}` );
      }

      dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.LOG_ENTRY_LAST_FAILED, failed:true });
    }
  });
}


