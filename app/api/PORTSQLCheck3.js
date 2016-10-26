
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as M2M from "./PORTSQLM2M.js"
import * as MISC from "./Misc.js"

var prod=false;

var portCheckDone=false;
var portCheckCnt=0;
var portCheckFailed=false;
var contChecks=false;
const ATTEMPTS=1;



/*******************CHECK IF PO HAS A VALID VENDOR IN M2M****************/
export async function portCheck(disp,getSt){
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 
  if ('development'==process.env.NODE_ENV) {
    console.dir(state);
    console.dir(getState);
  }


  var cnt=0;
  portCheckInit();
  portChk(dispatch,getState);

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
    if ('development'==process.env.NODE_ENV) {
      console.log(`portCheck3() Done`)
    }

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


function portChk(disp,getSt){
  var dispatch=disp;

  var getState = getSt;
  var state = getState(); 

  if ('development'==process.env.NODE_ENV) {
    console.dir(state);
    console.log(`portChk3(disp) top=>${portCheckCnt}`);
  }


  var cribConnection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`portChk3(disp) Connection Sucess`);
      }

      // Query
      let qry;
      if (prod===true) {
        qry = `
          select ROW_NUMBER() OVER(ORDER BY PONumber) id, po.PONumber, po.Address1, vendor.VendorNumber, vendor.UDFM2MVENDORNUMBER
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
          select ROW_NUMBER() OVER(ORDER BY PONumber) id,po.PONumber, po.Address1, vn.VendorNumber, vn.UDFM2MVENDORNUMBER
          from
          (
              SELECT PONumber,Vendor,Address1 FROM [btPO]  WHERE [btPO].POSTATUSNO = 3 and [btPO].SITEID <> '90'
          ) po
          left outer join
          btVendor vn
          on po.vendor = vn.VendorNumber
        `;
      }


      var request = new sql.Request(cribConnection); // or: var request = connection2.request();
      request.query(qry, function(err, recordset) {
        if(null==err){
          // ... error checks
          if ('development'==process.env.NODE_ENV) {
            console.log(`portChk3(disp) Query Sucess`);
            console.dir(recordset);
          }

          portCheckDone=true;
          if(recordset.length!==0){
            if ('development'==process.env.NODE_ENV) {
              console.log("portChk3.query had records.");
              console.dir(state.POReqTrans.m2mVendors);
            }

            let noM2mVen=[];
            recordset.forEach(function(po,i,arr){
              let found=state.POReqTrans.m2mVendors.find((m2mVendor)=>{return po.UDFM2MVENDORNUMBER==m2mVendor.fvendno});  
              if(found){
                if ('development'==process.env.NODE_ENV) {
                  console.log(`Vendor.UDFM2MVENDORNUMBER=${po.UDFM2MVENDORNUMBER} found in M2M`);
                }

              }else{
                let found=noM2mVen.find((m2mVendor)=>{return po.UDFM2MVENDORNUMBER==m2mVendor.UDFM2MVENDORNUMBER});
                if(!found){
                  noM2mVen.push(po);
                  if ('development'==process.env.NODE_ENV) {
                    console.log(`Vendor.UDFM2MVENDORNUMBER=${po.UDFM2MVENDORNUMBER} NOT found in M2M`);
                  }
                }  
              }
            });
            if(0!=noM2mVen.length){
              dispatch({ type:PORTACTION.SET_CHECK3, chk3:PORTCHK.FAILURE });
              dispatch({ type:PORTACTION.SET_NO_M2M_VEN, noM2mVen: noM2mVen });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_30_FAIL});
              dispatch({ type:PORTACTION.SET_STATUS, status:'Found Cribmaster vendor(s) with a missing or invalid Made2Manage vendor link...' });
              portCheckFailed=true;
            }else{
              contChecks=true;
              dispatch({ type:PORTACTION.SET_CHECK3, chk3:PORTCHK.SUCCESS});
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_30_PASS });
            }
          }else{
            contChecks=true;
            dispatch({ type:PORTACTION.SET_CHECK3, chk3:PORTCHK.SUCCESS});
            dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_30_PASS });
          }
      }else{
        if(++portCheckCnt<ATTEMPTS) {
          if ('development'==process.env.NODE_ENV) {
            console.log(`portChk3.query:  ${err.message}` );
            console.log(`portCheck3Cnt = ${portCheckCnt}`);
          }

        }else{
          dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
          dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
          portCheckFailed=true;
        }
      }
    });
  }else{
    if(++portCheckCnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`portChk3.Connection:  ${err.message}` );
        console.log(`portCheck3Cnt = ${portCheckCnt}`);
      }

    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      portCheckFailed=true;
    }
  }});
  
  cribConnection.on('error', function(err) {
    if(++portCheckCnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`portChk3.on('error', function(err):  ${err.message}` );
        console.log(`portCheck3Cnt = ${portCheckCnt}`);
      }

    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      portCheckFailed=true;
    }
  });
}


