var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"


var sql1Done=false;
var sql1Cnt=0;
var sql1Failed=false;
var contPORT=false;
const ATTEMPTS=1;



export async function sql1(disp,getSt){
  var dispatch=disp;
  var getState = getSt;
  var state = getState(); 

  var cnt=0;
  init();
  execSQL1(dispatch);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLM2M.sql1() Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLM2M.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLM2M.sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLM2M.sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLM2M.sql1(): Suceeded`)
    }
  }


}

function init(){
  sql1Done=false; 
  sql1Cnt=0;  
  sql1Failed=false;
  contPORT=false;
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
export function continuePORT(){
  if(true==contPORT)
  {
    return true;
  } else{
    return false;
  }
}

// DONE IN PORTSQLCM NOW!!!
function execSQL1(disp){
  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQLM2M.execSQL1() top=>${sql1Cnt}`);
  }
  var dispatch=disp;

  var m2mConnection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLM2M.execSQL1() Connection Sucess`);
      }

      // Query
      var request = new sql.Request(m2mConnection); 
      request.query(
      `
          select distinct fvendno,rtrim(av.fccompany) fccompany,
                rtrim(av.fcompany)  + ' - ' + av.fvendno
                as vendorSelect
          FROM apvend av
          inner join syaddr sa
          on av.fvendno = sa.fcaliaskey
          where fcalias = 'APVEND' 
          order by vendorSelect
      `, function(err, recordset) {
          if(null==err){
            // ... error checks
            var vendorSelect=[];
            recordset.forEach(function(vendor,i,arr){
              vendorSelect.push(vendor.vendorSelect);
            });
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLM2M.execSQL1() Query Sucess`);
              console.dir(recordset);
            }
            dispatch({ type:PORTACTION.SET_M2M_VENDOR_SELECT, m2mVendorSelect:vendorSelect });
            dispatch({ type:PORTACTION.SET_M2M_VENDORS, m2mVendors:recordset });
            sql1Done=true;
            contPORT=true;
          }else{
            if(++sql1Cnt<ATTEMPTS) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`PORTSQLM2M.execSQL1().query:  ${err.message}` );
                console.log(`sql1Cnt = ${sql1Cnt}`);
              }
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              sql1Failed=true;
            }
          }
        }
      );
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLM2M.execSQL1().Connection:  ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        sql1Failed=true;
      }
    }
  });
  
  m2mConnection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLM2M.execSQL1().m2mConnection.on('error', function(err):  ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}



