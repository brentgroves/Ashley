
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"

var prod=false;

var portCheck2Done=false;
var portCheck2Cnt=0;
var portCheck2Failed=false;
var contChecks=false;

/*******************CHECK IF PO HAS A VALID VENDOR IN CRIBMASTER****************/
export async function portCheck2(disp){
  var dispatch=disp;
  var cnt=0;
  portCheck2Init();
  portChk2(dispatch);

  while(!isPortCheck2Done() && !portCheck2Failed){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`portCheck2(disp) Cannot Connection` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isPortCheck2Done()){
    console.log(`portCheck2() Done`)
  }

}

function portCheck2Init(){
  portCheck2Done=false;
  portCheck2Cnt=0;
  portCheck2Failed=false;
  contChecks=false;
}

export function isPortCheck2Done(){
  if(
    (true==portCheck2Done)
    )
  {
    return true;
  } else{
    return false;
  }
}

export function didCheckFail(){
  if(
    (true==portCheck2Failed)
    )
  {
    return true;
  } else{
    return false;
  }
}

export function continueChecks(){
  if(true==contChecks)
  {
    return true;
  } else{
    return false;
  }
}

/********************CHECK IF ALL PO CATEGORIES HAVE BEEN SELECTED FOR EACH PO ITEM & THE RECORDS ARE NOT LOCKED****************/

function portChk2(disp){
  var dispatch=disp;
  console.log(`portChk2(disp) top=>${portCheck2Cnt}`);

  var cribConnection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      console.log(`portChk2(disp) Connection Sucess`);
      // Query
      let qry;
      if (prod===true) {
        qry = `
          select ROW_NUMBER() OVER(ORDER BY PONumber) id, po.PONumber, po.Address1
          from
          (
              SELECT PONumber,Vendor,Address1 FROM [PO]  WHERE [PO].POSTATUSNO = 3 and [PO].SITEID <> '90'
          ) po
          left outer join
          vendor
          on po.vendor = Vendor.VendorNumber
          where Vendor.VendorNumber is null
        `;
      }else{
        qry = `
          select ROW_NUMBER() OVER(ORDER BY PONumber) id,po.PONumber, po.Address1
          from
          (
              SELECT PONumber,Vendor,Address1 FROM [btPO]  WHERE [btPO].POSTATUSNO = 3 and [btPO].SITEID <> '90'
          ) po
          left outer join
          vendor
          on po.vendor = Vendor.VendorNumber
          where Vendor.VendorNumber is null
        `;
      }


      var request = new sql.Request(cribConnection); // or: var request = connection2.request();
      request.query(
      qry, function(err, recordset) {
          if(null==err){
            // ... error checks
            console.log(`portChk2(disp) Query Sucess`);
            console.dir(recordset);
            portCheck2Done=true;
            if(recordset.length!==0){
              console.log("portCheck2 query had records.");
              dispatch({ type:PORTACTION.SET_CHECK2, chk2:PORTCHK.FAILURE });
              dispatch({ type: PORTACTION.SET_NO_CRIB_VEN, noCribVen:recordset });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_20_FAIL});
            }else {
              dispatch({ type:PORTACTION.SET_CHECK2, chk2:PORTCHK.SUCCESS});
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_20_PASS });
              contChecks=true;
            }
          }else{
            if(++portCheck2Cnt<3) {
              console.log(`portChk2.query:  ${err.message}` );
              console.log(`portCheck2Cnt = ${portCheck2Cnt}`);
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              portCheck2Failed=true;
            }
          }
        }
      );
    }else{
      if(++portCheck2Cnt<3) {
        console.log(`portChk2.Connection:  ${err.message}` );
        console.log(`portCheck2Cnt = ${portCheck2Cnt}`);
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        portCheck2Failed=true;
      }
    }
  });
  
  cribConnection.on('error', function(err) {
    if(++portCheck2Cnt<3) {
      console.log(`portChk2.on('error', function(err):  ${err.message}` );
      console.log(`portCheck2Cnt = ${portCheck2Cnt}`);
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      portCheck2Failed=true;
    }
  });
}


