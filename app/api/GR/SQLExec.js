var sql = require('mssql');
import * as GRACTION from "../../actions/GRConst.js"
import * as GRSTATE from "../../actions/GRState.js"
import * as CONNECT from "../SQLConst.js"
import * as MISC from "../Misc.js"



var sql1Cnt=0;
const ATTEMPTS=1;



export async function sql1(disp,getSt,dbconn,sqlSt){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var dbConnect=dbconn;
  var sqlStatement=sqlSt;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLExec()->top.`);
    console.dir(CONNECT.crib);
  }

  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState,dbConnect,sqlStatement);

}

function init(dispatch){
  sql1Cnt=0;               
  dispatch({ type:GRACTION.SQL_EXEC_FAILED, failed:false });
  dispatch({ type:GRACTION.SQL_EXEC_DONE, done:false });
}


function execSQL1(disp,getSt,dbconn,sqlSt){
  var dispatch = disp;
  var getState = getSt;
  var dbConnect=dbconn;
  var sqlStatement=sqlSt;

  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLExec.execSQL1() top=>${sql1Cnt}`);
    console.dir(dbConnect);
  }


  var connection = new sql.Connection(dbConnect, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLExec.execSQL1() Connection Sucess`);
      }

      var request = new sql.Request(connection); 
      request.query(sqlStatement, function(err, recordset) {
        // ... error checks
        if(null==err){
          // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLExec.execSQL1() Sucess`);
          }
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLExec.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLExec.execSQL1():  ${err.message}` );
            }
            dispatch({ type:GRACTION.SET_REASON, reason:err.message });
            dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
            dispatch({ type:GRACTION.SQL_EXEC_FAILED, failed:true });
          }
        }
      });
      dispatch({ type:GRACTION.SQL_EXEC_DONE, done:true });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLExec.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLExec.Connection: ${err.message}` );
        }

        dispatch({ type:GRACTION.SET_REASON, reason:err.message });
        dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
        dispatch({ type:GRACTION.SQL_EXEC_FAILED, failed:true });
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLExec.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLExec.connection.on(error): ${err.message}` );
      }

      dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.SQL_EXEC_FAILED, failed:true });
    }
  });
}


