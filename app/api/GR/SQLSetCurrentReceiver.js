
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
    console.log(`SQLSetCurrentReceiver=> top`);
  }


  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState);
}

function init(dispatch){
  sql1Cnt=0;               
  dispatch({ type:GRACTION.CURRENT_RECEIVER_FAILED, failed:false });
  dispatch({ type:GRACTION.CURRENT_RECEIVER_DONE, done:false });
}




function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState=getSt;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLSetCurrentReceiver.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSetCurrentReceiver.execSQL1() Connection Sucess`);
      }

      let sproc;

      if (MISC.PROD===true) {
        sproc = `bpGRSetCurrentReceiver'
          `;
      }else{
        sproc = `bpGRSetCurrentReceiverDev`;
      }

      let receiverCount=getState().GenReceivers.receiverCount;
      var request = new sql.Request(connection); 
      request.input('receiverCount', sql.Int,receiverCount);
      request.output('currentReceiver', sql.Char(6));

      request.execute(sproc, function(err, recordset) {
        // ... error checks
        if(null==err){
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLSetCurrentReceiver.execSQL1() Sucess`);
          }
          let currentReceiver=request.parameters.currentReceiver.value;
          if ('development'==process.env.NODE_ENV) {
            console.log("SQLSetCurrentReceiver.execSQL1() had records.");
            console.log(`currentReceiver=>${currentReceiver}`);
          }
          dispatch({ type:GRACTION.SET_CURRENT_RECEIVER, currentReceiver:currentReceiver});
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLSetCurrentReceiver.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLSetCurrentReceiver.execSQL1() err:  ${err.message}` );
            }
            dispatch({ type:GRACTION.SET_REASON, reason:err.message });
            dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
            dispatch({ type:GRACTION.CURRENT_RECEIVER_FAILED, failed:true });
          }
        }
        dispatch({ type:GRACTION.CURRENT_RECEIVER_DONE, done:true });

      });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLSetCurrentReceiver.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLSetCurrentReceiver.Connection: ${err.message}` );
        }
        dispatch({ type:GRACTION.SET_REASON, reason:err.message });
        dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
        dispatch({ type:GRACTION.CURRENT_RECEIVER_FAILED, failed:true });
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSetCurrentReceiver.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSetCurrentReceiver.connection.on(error): ${err.message}` );
      }
      dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.CURRENT_RECEIVER_FAILED, failed:true });
    }
  });
}


