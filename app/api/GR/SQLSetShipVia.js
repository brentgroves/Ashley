
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
  var state = getState(); 
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLSetCurrentReceiver=> top`);
  }


  var cnt=0;
  init();
  execSQL1(dispatch);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:GRACTION.SET_REASON, reason:`SetSQLShipVia.sql1() Timed Out or Failed.` });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSetShipVia.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSetShipVia.sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSetShipVia.sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`SQLSetShipVia.sql1(): Suceeded`)
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



function execSQL1(disp){
  var dispatch = disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLSetShipVia.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSetShipVia.execSQL1() Connection Sucess`);
      }

      let qry;

      if (MISC.PROD===true) {
        qry = `
          select distinct rtrim(ffrtcarr) ffrtcarr
          from rcmast 
          where ffrtcarr <> ''
          order by ffrtcarr desc
          `;
      }else{
        qry = `
          select distinct rtrim(ffrtcarr) ffrtcarr
          from rcmast 
          where ffrtcarr <> ''
          order by ffrtcarr desc
          `;
      }


      var request = new sql.Request(connection); 
      request.query(qry, function(err, recordset) {
        // ... error checks
        if(null==err){
          if ('development'==process.env.NODE_ENV) {
            console.log(`SQLSetShipVia.execSQL1() Sucess`);
          }
          if(recordset.length!==0){
            let currentReceiver=parseInt(recordset[0].fcnumber);
            if ('development'==process.env.NODE_ENV) {
              console.log("SQLSetShipVia.execSQL1() had records.");
              console.log(`ffrtcarr=>${recordset[0].ffrtcarr}`);
            }
            dispatch({ type:GRACTION.SET_SHIP_VIA, shipVia:recordset});
            contGR=true;
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLSetShipVia.execSQL1() err: Could not retrieve ffrtcarr.` );
            }
            dispatch({ type:GRACTION.SET_REASON, reason:'Could not retrieve ffrtcarr.' });
            dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
            sql1Failed=true;
          }
          sql1Done=true;
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLSetShipVia.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLSetShipVia.execSQL1() err:  ${err.message}` );
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
          console.log(`SQLSetShipVia.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLSetShipVia.Connection: ${err.message}` );
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
        console.log(`SQLSetShipVia.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLSetShipVia.connection.on(error): ${err.message}` );
      }
      dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}


