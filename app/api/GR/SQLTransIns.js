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
    console.log(`SQLTransIns()->top.`);
  }


  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState);

}

function init(dispatch){
  sql1Cnt=0;
  dispatch({ type:GRACTION.TRANS_INS_FAILED, failed:false });
  dispatch({ type:GRACTION.TRANS_INS_DONE, done:false });
}


function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;

  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLTransIns.execSQL1() top=>${sql1Cnt}`);
  }

  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      let sessionId=state.GenReceivers.logId;      
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLTransIns.execSQL1() Connection Sucess`);
        console.log(`SQLFinish.execSQL1() sessionId => ${sessionId}`);
      }
      let sproc;

      if (MISC.PROD===true) {
        sproc = `bpGRTransIns`;
      }else{
        sproc = `bpGRTransInsDev`;
      }

      var allInsSucceded=true;

      state.GenReceivers.rcitem.forEach(function(rcitem,i,arr){
        if ('development'==process.env.NODE_ENV) {
         // console.log(`po.forddate=>${po.forddate}`);
        }

        let fpckLen = rcmast.fpacklist.trim().length;
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLTransIns.execSQL1().fpacklist.length=>${fpckLen}`);
        }
        if(fpckLen>0){
          var request = new sql.Request(connection); 
          request.input('freceiver',sql.Char(6),rcitem.freceiver);
          request.input('sessionId',sql.Int,sessionId);
          request.execute(sproc, function(err, recordsets, returnValue) {
            // ... error checks
            if(null==err){
              // ... error checks
              if ('development'==process.env.NODE_ENV) {
                console.log(`SQLTransIns.execSQL1() Sucess`);
              }
            }else {
              if(++sql1Cnt<ATTEMPTS) {
                if ('development'==process.env.NODE_ENV) {
                  console.log(`SQLTransIns.execSQL1().query:  ${err.message}` );
                  console.log(`sql1Cnt = ${sql1Cnt}`);
                }
              }else{
                if ('development'==process.env.NODE_ENV) {
                  console.log(`SQLTransIns.execSQL1():  ${err.message}` );
                }
                dispatch({ type:GRACTION.SET_REASON, reason:err.message });
                dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
                dispatch({ type:GRACTION.TRANS_INS_FAILED, failed:true });
                allInsSucceded=false;
              }
            }
          });
        }
      });
      if(!allInsSucceded){
        dispatch({ type:GRACTION.TRANS_INS_FAILED, failed:true });
      }

      dispatch({ type:GRACTION.TRANS_INS_DONE, done:true });
     
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLTransIns.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLTransIns.Connection: ${err.message}` );
        }

        dispatch({ type:GRACTION.SET_REASON, reason:err.message });
        dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
        dispatch({ type:GRACTION.TRANS_INS_FAILED, failed:true });
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLTransIns.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLTransIns.connection.on(error): ${err.message}` );
      }

      dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.TRANS_INS_FAILED, failed:true });
    }
  });
}


