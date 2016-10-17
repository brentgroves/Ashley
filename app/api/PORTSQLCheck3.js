
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"

var prod=false;

var portCheckDone=false;
var portCheckCnt=0;
var portCheckFailed=false;
var contChecks=false;

/*******************CHECK IF PO HAS A VALID VENDOR IN M2M****************/
export async function portCheck(disp){
  var dispatch=disp;
  var cnt=0;
  portCheckInit();
  portChk(dispatch);

  while(!isPortCheckDone() && !portCheckFailed){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`portCheck3(disp) Cannot Connection` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isPortCheckDone()){
    console.log(`portCheck3() Sucess`)
  }

}

function portCheckInit(){
  portCheckDone=false;
  portCheckCnt=0;
  portCheckFailed=false;
  contChecks=false;
}

export function isPortCheckDone(){
  if(
    (true==portCheckDone)
    )
  {
    return true;
  } else{
    return false;
  }
}

export function didCheckFail(){
  if(
    (true==portCheckFailed)
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


function portChk(disp){
  var dispatch=disp;
  console.log(`portChk3(disp) top=>${portCheckCnt}`);

  var cribConnection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      console.log(`portChk3(disp) Connection Sucess`);
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
        `;
      }


      var request = new sql.Request(cribConnection); // or: var request = connection2.request();
      request.query(
      qry, function(err, recordset) {
          if(null==err){
            // ... error checks
            console.log(`portChk3(disp) Query Sucess`);
            console.dir(recordset);
            portCheckDone=true;
            if(recordset.length!==0){
              console.log("portChk3.query had records.");
              contChecks=true;

/*              dispatch({ type:PORTACTION.SET_CHECK2, chk2:PORTCHK.FAILURE });
              dispatch({ type: PORTACTION.SET_PO_REQ, poReq:recordset });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_20_FAIL});
*/          }else {
              dispatch({ type:PORTACTION.SET_CHECK3, chk3:PORTCHK.SUCCESS});
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_30_PASS });
            }
          }else{
            if(++portCheckCnt<3) {
              console.log(`portChk3.query:  ${err.message}` );
              console.log(`portCheck3Cnt = ${portCheckCnt}`);
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              portCheckFailed=true;
            }
          }
        }
      );
    }else{
      if(++portCheckCnt<3) {
        console.log(`portChk3.Connection:  ${err.message}` );
        console.log(`portCheck3Cnt = ${portCheckCnt}`);
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        portCheckFailed=true;
      }
    }
  });
  
  cribConnection.on('error', function(err) {
    if(++portCheckCnt<3) {
      console.log(`portChk3.on('error', function(err):  ${err.message}` );
      console.log(`portCheck3Cnt = ${portCheckCnt}`);
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      portCheckFailed=true;
    }
  });
}


