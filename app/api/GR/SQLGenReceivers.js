
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
  var state = getState(); 
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLGenReceivers=> top`);
  }


  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState);
}

function init(dispatch){
  sql1Cnt=0;               
  dispatch({ type:GRACTION.GEN_RECEIVERS_FAILED, failed:false });
  dispatch({ type:GRACTION.GEN_RECEIVERS_DONE, done:false });
}



function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState=getSt;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLGenReceivers.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLGenReceivers.execSQL1() Connection Sucess`);
      }

      let sproc;

      if (MISC.PROD===true) {
        sproc = `bpGRGenReceivers`;
      }else{
        // STARTED USING bpGRGenReceivers ON 11-29
        sproc = `bpGRGenReceivers`;
//        sproc = `bpGRGenReceiversDev`;
      }

      let currentReceiver = getState().GenReceivers.currentReceiver;

      var request = new sql.Request(connection); 
      request.input('currentReceiver', sql.Int,currentReceiver);
      request.execute(sproc, function(err, recordsets, returnValue, affected) {
        // ... error checks
        if(null==err){
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLGenReceivers.execSQL1() Sucess`);
/*            console.log(recordsets.length); // count of recordsets returned by the procedure
            console.log(recordsets[0].length); // count of rows contained in first recordset
            console.log(returnValue); // procedure return value
            console.log(recordsets.returnValue); // same as previous line
            console.log(affected); // number of rows affected by the statemens
            console.log(recordsets.rowsAffected); // same as previous line
            console.log(request.parameters.postart.value); // output value
            console.log(request.parameters.poend.value); // output value
*/          }
          dispatch({ type:GRACTION.SET_RCMAST,rcmast:recordsets[0]});
          dispatch({ type:GRACTION.SET_RCITEM,rcitem:recordsets[1]});
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLGenReceivers.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLGenReceivers.execSQL1() err:  ${err.message}` );
            }
            dispatch({ type:GRACTION.SET_REASON, reason:err.message });
            dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
            dispatch({ type:GRACTION.GEN_RECEIVERS_FAILED, failed:true });
          }
        }
        dispatch({type:GRACTION.GEN_RECEIVERS_DONE,done:true})
      });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLGenReceivers.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLGenReceivers.Connection: ${err.message}` );
        }
        dispatch({ type:GRACTION.SET_REASON, reason:err.message });
        dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
        dispatch({ type:GRACTION.SGEN_RECEIVERS_FAILED, failed:true });
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLGenReceivers.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLGenReceivers.connection.on(error): ${err.message}` );
      }
      dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.SGEN_RECEIVERS_FAILED, failed:true });
    }
  });
}


