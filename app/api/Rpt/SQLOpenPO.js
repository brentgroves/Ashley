var sql = require('mssql');
import * as ACTION from "../../actions/Rpt/Const.js"
import * as STATE from "../../actions/Rpt/State.js"
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
    console.log(`SQLOpenPO()->top.`);
  }


  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState);

}

function init(dispatch){
  sql1Cnt=0;
  dispatch({ type:ACTION.SQL_OPENPO_FAILED, failed:false });
  dispatch({ type:ACTION.SQL_OPENPO_DONE, done:false });
}


function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;

  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLOpenPO.execSQL1() top=>${sql1Cnt}`);
  }

  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLOpenPO.execSQL1() Connection Sucess`);
      }

      let sproc;

      if (MISC.PROD===true) {
        sproc = `bpGROpenPO`;
      }else{
        // not using a separate dev log
        sproc = `bpGROpenPO`;
      }

      var request = new sql.Request(connection); 
      request.execute(sproc, function(err, recordsets, returnValue, affected) {
        // ... error checks
        if(null==err){
          // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLOpenPO.execSQL1() Sucess`);
          }
//          let logId = request.parameters.id.value;
          var poNew = recordsets[0].map(function(x){
            return x.poNumber.toString(); 
          });

          dispatch({ type:ACTION.SET_OPENPO_PO, po:poNew });
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLOpenPO.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLOpenPO.execSQL1():  ${err.message}` );
            }
            dispatch({ type:ACTION.SET_REASON, reason:err.message });
            dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
            dispatch({ type:ACTION.SQL_OPENPO_FAILED, failed:true });
          }
        }
      });
      dispatch({ type:ACTION.SQL_OPENPO_DONE, done:true });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLOpenPO.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLOpenPO.Connection: ${err.message}` );
        }

        dispatch({ type:ACTION.SET_REASON, reason:err.message });
        dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
        dispatch({ type:ACTION.SQL_OPENPO_FAILED, failed:true });
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLOpenPO.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLOpenPO.connection.on(error): ${err.message}` );
      }

      dispatch({ type:ACTION.SET_REASON, reason:err.message });
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SQL_OPENPO_FAILED, failed:true });
    }
  });
}


