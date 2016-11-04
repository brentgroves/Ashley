
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as COMMON from "../actions/CommonConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"

var sql1Done=false;
var sql1Cnt=0;
var sql1Failed=false;
var sql2Done=false;
var sql2Cnt=0;
var sql2Failed=false;
const ATTEMPTSCRIB=1;
const ATTEMPTSM2M=3;
const MAXCNT=10;



export async function sql1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 
  var timedOut=false;
  if ('development'==process.env.NODE_ENV) {
    console.log(`primeDB top`);
  }

  var cnt=0;
  init();
  dispatch({ type:COMMON.SET_PRIMED, primed:false });

  execSQL1(dispatch);
  execSQL2(dispatch);
  execSQL2(dispatch);
  execSQL2(dispatch);
  execSQL2(dispatch);

  while(!isDone() && !didFail()){
    if(++cnt>MAXCNT){
      timedOut=true;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLPrimeDB.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLPrimeDB.sql1(): Did NOT Complete`)
    }
  }

  if(didFail() || timedOut){
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLPrimeDB.sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLPrimeDB.sql1(): Suceeded`)
    }
//    dispatch({ type:PORTACTION.SET_PRIMED, primed:true });
    dispatch({ type:COMMON.SET_PRIMED, primed:true });
  }


}

function init(){
  sql1Done=false; 
  sql1Cnt=0;  
  sql1Failed=false;
  sql2Done=false;
  sql2Cnt=0;
  sql2Failed=false;
}

export function isDone(){
  if(
    (true==sql1Done) ||
    (true==sql2Done) 
    )
  {
    return true;
  } else{
    return false;
  }
}

export function didFail(){
  if(
    (true==sql1Failed) &&
    (true==sql2Failed) 
    )
  {
    return true;
  } else{
    return false;
  }
}


function execSQL1(disp){
  var dispatch=disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLPrimeDB.execSQL1() top=>${sql1Cnt}`);
  }

  var cribConnection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLPrimeDB.execSQL1() Connection Sucess`);
      }
      // Query
      var request = new sql.Request(cribConnection); // or: var request = connection1.request();
      request.query(
      `
      SELECT ItemClass
      FROM ITEMCLASS
      where itemclassno < 5

       `, function(err, recordset) {
          if(null==err){
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLPrimeDB.execSQL1() Query Sucess`);
            }
            sql1Done=true;
          }else{
            if(++sql1Cnt<ATTEMPTSCRIB) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`SQLPrimeDB.execSQL1().query:  ${err.message}` );
                console.log(`sql1Cnt = ${sql1Cnt}`);
              }
            }else{
              sql1Failed=true;
            }
          }
        }
      );
    }else{
      if(++sql1Cnt<ATTEMPTSCRIB) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLPrimeDB.execSQL1().Connection:  ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        sql1Failed=true;
      }
    }
  });
  
  cribConnection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTSCRIB) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLPrimeDB.execSQL1().cribConnection.on('error', function(err):  ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }
    }else{
      sql1Failed=true;
    }
  });
}

function execSQL2(disp){
  var dispatch=disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLPrimeDB.execSQL2() top=>${sql2Cnt}`);
  }


  var m2mConnection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLPrimeDB.execSQL2() Connection Sucess`);
      }
      let qry = `SELECT FCNUMBER FROM SYSEQU WHERE fcclass = 'RCMAST.FRECEIVER'`;
 
      var request = new sql.Request(m2mConnection); // or: var request = connection1.request();
      request.query(qry,
        function(err, recordset) {
          if(null==err){
            // ... error checks
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLPrimeDB.execSQL2() Query Sucess`);
            }
            sql2Done=true;
          }else{
            if(++sql2Cnt<ATTEMPTSM2M) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`SQLPrimeDB.execSQL2().query:  ${err.message}` );
                console.log(`sql2Cnt = ${sql2Cnt}`);
              }
            }else{
              sql2Failed=true;
            }
          }
        }
      );
    }else{
      if(++sql2Cnt<ATTEMPTSM2M) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLPrimeDB.execSQL2().Connection:  ${err.message}` );
          console.log(`sql2Cnt = ${sql2Cnt}`);
        }
      }else{
        sql2Failed=true;
      }
    }
  });
  
  m2mConnection.on('error', function(err) {
    if(++sql2Cnt<ATTEMPTSM2M) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLPrimeDB.execSQL2().m2mConnection.on('error', function(err):  ${err.message}` );
        console.log(`sql2Cnt = ${sql2Cnt}`);
      }
    }else{
      sql2Failed=true;
    }
  });
}

