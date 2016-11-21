
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
    console.log(`SQLSetShipVia=> top`);
  }

  var cnt=0;
  init(dispatch);
  execSQL1(dispatch);
}

function init(){
  sql1Cnt=0;               
  dispatch({ type:GRACTION.SHIP_VIA_FAILED, failed:false });
  dispatch({ type:GRACTION.SHIP_VIA_DONE, done:false });
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

            var shipVia=[];
            recordset.forEach(function(carrier,i,arr){
              if ('development'==process.env.NODE_ENV) {
                console.log(`carrier.ffrtcarr=>${carrier.ffrtcarr}`);
              }
              shipVia.push(carrier.ffrtcarr);
            });

            dispatch({ type:GRACTION.SET_SHIP_VIA, shipVia:shipVia});
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLSetShipVia.execSQL1() err: Could not retrieve ffrtcarr.` );
            }
            dispatch({ type:GRACTION.SET_REASON, reason:'Could not retrieve ffrtcarr.' });
            dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
            dispatch({ type:GRACTION.SHIP_VIA_FAILED, failed:true });
          }
          dispatch({ type:GRACTION.SHIP_VIA_DONE, done:true });
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
            dispatch({ type:GRACTION.SHIP_VIA_FAILED, failed:true });
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
        dispatch({ type:GRACTION.SHIP_VIA_FAILED, failed:true });
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
      dispatch({ type:GRACTION.SHIP_VIA_FAILED, failed:true });
    }
  });
}


