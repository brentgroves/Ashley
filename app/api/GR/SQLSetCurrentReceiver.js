
var sql = require('mssql');
import * as GRACTION from "../../actions/GRConst.js"
import * as GRSTATE from "../../actions/GRState.js"
import * as CONNECT from "../SQLConst.js"
import * as MISC from "../Misc.js"


var sql1Done=false;
var sql1Cnt=0;
var sql1Failed=false;
var contGR=false;
const ATTEMPTS=1;



export async function sql1(disp,getSt){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLSetCurrentReceiver=> top`);
  }


  var cnt=0;
  init();
  execSQL1(dispatch,getState);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:GRACTION.SET_REASON, reason:`SetSQLCurrentReceiver.sql1() Timed Out or Failed.` });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSetCurrentReceiver.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSetCurrentReceiver.sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSetCurrentReceiver.sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSetCurrentReceiver.sql1(): Suceeded`)
    }
  }

}

function init(){
  sql1Done=false;
  sql1Cnt=0;
  sql1Failed=false;
  contGR=false;
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
export function continueGR(){
  if(true==contGR)
  {
    return true;
  } else{
    return false;
  }
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
        sproc = `bpGRSetCurrentReceiverDev'
          `;
      }else{
        sproc = `bpGRSetCurrentReceiver`;
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
          contGR=true;
          sql1Done=true;
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
            sql1Failed=true;
          }
        }
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
        sql1Failed=true;
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
      sql1Failed=true;
    }
  });
}


