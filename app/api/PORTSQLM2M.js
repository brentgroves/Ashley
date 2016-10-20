var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"

var prod=false;

var portQuery1Done=false;
var portQuery1Cnt=0;
var portQueriesFailed=false;
const ATTEMPTS=1;


export async function portM2mQueries(disp){
  var dispatch=disp;
  var cnt=0;
  portQueriesInit();
  portQuery1(dispatch);

  while(!arePortQueriesDone() && !portQueriesFailed){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`portM2mQueries(disp) Cannot Connection` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(arePortQueriesDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`portM2mQueries() Sucess`)
    }
  }

}

export function portQueriesInit(){
  portQuery1Done=false;
  portQuery1Cnt=0;
  portQueriesFailed=false;
}

export function arePortQueriesDone(){
  if(
    (true==portQuery1Done) 
    )
  {
    return true;
  } else{
    return false;
  }
}

export function didPortQueriesFail(){
  if(true == portQueriesFailed) 
  {
    return true;
  } else{
    return false;
  }
}

function portQuery1(disp){
  if ('development'==process.env.NODE_ENV) {
    console.log(`portQuery1(disp) top=>${portQuery1Cnt}`);
  }
  var dispatch=disp;

  var m2mConnection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`portQuery1(disp) Connection Sucess`);
      }

      // Query
      var request = new sql.Request(m2mConnection); 
      request.query(
      // Remove duplicate records but a fcompany may still be in here twice.
      `
          select distinct fvendno,
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
              console.log(`portQuery1(disp) Query Sucess`);
              console.dir(recordset);
            }
            dispatch({ type:PORTACTION.SET_M2M_VENDOR_SELECT, m2mVendorSelect:vendorSelect });
            dispatch({ type:PORTACTION.SET_M2M_VENDORS, m2mVendors:recordset });
            //m2mVendors=recordset;
            portQuery1Done=true;
          }else{
            if(++portQuery1Cnt<ATTEMPTS) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`portQuery1.query:  ${err.message}` );
                console.log(`portQuery1Cnt = ${portQuery1Cnt}`);
              }
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              portQueriesFailed=true;
            }
          }
        }
      );
    }else{
      if(++portQuery1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`portQuery1.Connection:  ${err.message}` );
          console.log(`portQuery1Cnt = ${portQuery1Cnt}`);
        }
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        portQueriesFailed=true;
      }
    }
  });
  
  m2mConnection.on('error', function(err) {
    if(++portQuery1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`m2mConnection.on('error', function(err):  ${err.message}` );
        console.log(`portQuery1Cnt = ${portQuery1Cnt}`);
      }
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      portQueriesFailed=true;
    }
  });
}



