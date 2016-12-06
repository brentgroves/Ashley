var sql = require('mssql');
import * as GRACTION from "../../actions/GRConst.js"
import * as GRSTATE from "../../actions/GRState.js"
import * as CONNECT from "../SQLConst.js"
import * as MISC from "../Misc.js"


var sql1Cnt=0;
const ATTEMPTS=1;



export async function sql1(disp,getSt,del,step,last){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var delrc = del;
  var fstep = step;
  var lastRun = last;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLFinish()->top.`);
  }


  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState,delrc,fstep,lastRun);

}

function init(dispatch){
  sql1Cnt=0;
  dispatch({ type:GRACTION.FINISH_FAILED, failed:false });
  dispatch({ type:GRACTION.FINISH_DONE, done:false });
}


function execSQL1(disp,getSt,del,step,last){
  var dispatch = disp;
  var getState = getSt;
  var delrc = del;
  var fstep = step;
  var lastRun = last;

  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLFinish.execSQL1() top=>${sql1Cnt}`);
  }

  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLFinish.execSQL1() Connection Sucess`);
        console.log(`SQLFinish.execSQL1() delrc => ${delrc}`);
        console.log(`SQLFinish.execSQL1() fstep => ${fstep}`);
        console.log(`SQLFinish.execSQL1() lastRun => ${lastRun}`);
      }
      let sproc;

      if (MISC.PROD===true) {
        sproc = `bpGRFinish`;
      }else{
        // no need for a dev version of this sproc
        sproc = `bpGRFinish`;
      }


      var request = new sql.Request(connection); 
      request.input('delrc',sql.Bit,delrc);
      request.input('step',sql.VarChar(50),fstep);
      request.input('lastRun',sql.Bit,lastRun);
      request.execute(sproc, function(err, recordsets, returnValue) {
        // ... error checks
        if(null==err){
          // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLFinish.execSQL1() Sucess`);
          }
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLFinish.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLFinish.execSQL1():  ${err.message}` );
            }
            dispatch({ type:GRACTION.SET_REASON, reason:err.message });
            dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
            dispatch({ type:GRACTION.FINISH_FAILED, failed:true });
          }
        }
      });
      dispatch({ type:GRACTION.FINISH_DONE, done:true });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLFinish.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLFinish.Connection: ${err.message}` );
        }

        dispatch({ type:GRACTION.SET_REASON, reason:err.message });
        dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
        dispatch({ type:GRACTION.FINISH_FAILED, failed:true });
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLFinish.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLFinish.connection.on(error): ${err.message}` );
      }

      dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.FINISH_FAILED, failed:true });
    }
  });
}


