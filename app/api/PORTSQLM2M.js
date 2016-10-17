var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"

var prod=false;

var portQuery1Done=false;
var portQuery1Cnt=0;
var portQuery2Done=false;
var portQuery2Cnt=0;
var portQueriesFailed=false;

export async function portM2mQueries(disp){
  var dispatch=disp;
  var cnt=0;
  portQueriesInit();
  portQuery1(dispatch);
  portQuery2(dispatch);

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
    console.log(`portM2mQueries() Sucess`)
  }

}

export function portQueriesInit(){
  portQuery1Done=false;
  portQuery1Cnt=0;
  portQuery2Done=false;
  portQuery2Cnt=0;
  portQueriesFailed=false;
}

export function arePortQueriesDone(){
  if(
    (true==portQuery1Done) &&
    (true==portQuery2Done)
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
  var dispatch=disp;
  console.log(`portQuery1(disp) top=>${portQuery1Cnt}`);

  var m2mConnection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      console.log(`portQuery1(disp) Connection Sucess`);
      // Query

      var request = new sql.Request(m2mConnection); // or: var request = connection1.request();
      request.query(
      `
        select av.fvendno, av.fcompany
        from
        (
          SELECT max(fvendno) fvendno, fcompany
          from
          (
            select fvendno, fcompany
            FROM apvend av
            inner join syaddr sa
            on av.fvendno = sa.fcaliaskey
            where fcalias = 'APVEND'
          ) lv1
          group by fcompany
        ) lv2
        inner join
        apvend av
        on lv2.fvendno=av.fvendno
      `, function(err, recordset) {
          if(null==err){
            // ... error checks
            console.log(`portQuery1(disp) Query Sucess`);
            console.dir(recordset);
            portQuery1Done=true;
          }else{
            if(++portQuery1Cnt<3) {
              console.log(`portQuery1.query:  ${err.message}` );
              console.log(`portQuery1Cnt = ${portQuery1Cnt}`);
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              portQueriesFailed=true;
            }
          }
        }
      );
    }else{
      if(++portQuery1Cnt<3) {
        console.log(`portQuery1.Connection:  ${err.message}` );
        console.log(`portQuery1Cnt = ${portQuery1Cnt}`);
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        portQueriesFailed=true;
      }
    }
  });
  
  m2mConnection.on('error', function(err) {
    if(++portQuery1Cnt<3) {
      console.log(`portQuery1.on('error', function(err):  ${err.message}` );
      console.log(`portQuery1Cnt = ${portQuery1Cnt}`);
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      portQueriesFailed=true;
    }
  });
}


function portQuery2(disp){
  var dispatch=disp;
  console.log(`portQuery2(disp) top=>${portQuery2Cnt}`);

  var m2mConnection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      console.log(`portQuery2(disp) Connection Sucess`);
      // Query

      var request = new sql.Request(m2mConnection); // or: var request = connection1.request();
      request.query(`
        select 
            rtrim(av.fcompany)  + ' - ' + av.fvendno
            as vendorSelect
        from
        (
          SELECT max(fvendno) fvendno, fcompany
          from
          (
            select fvendno, fcompany
            FROM apvend av
            inner join syaddr sa
            on av.fvendno = sa.fcaliaskey
            where fcalias = 'APVEND'
          ) lv1
          group by fcompany
        ) lv2
        inner join
        apvend av
        on lv2.fvendno=av.fvendno
        `,
        function(err, recordset) {
          if(null==err){
            // ... error checks
            console.log(`portQuery2(disp) Query Sucess`);
            console.dir(recordset);
            portQuery2Done=true;
          }else{
            if(++portQuery2Cnt<3) {
              console.log(`portQuery2.query:  ${err.message}` );
              console.log(`portQuery2Cnt = ${portQuery2Cnt}`);
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              portQueriesFailed=true;
            }
          }
        }
      );
    }else{
      if(++portQuery2Cnt<3) {
        console.log(`portQuery2.Connection:  ${err.message}` );
        console.log(`portQuery2Cnt = ${portQuery2Cnt}`);
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        portQueriesFailed=true;
      }
    }
  });
  
  m2mConnection.on('error', function(err) {
    if(++portQuery2Cnt<3) {
      console.log(`portQuery2.on('error', function(err):  ${err.message}` );
      console.log(`portQuery2Cnt = ${portQuery2Cnt}`);
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      portQueriesFailed=true;
    }
  });
}

