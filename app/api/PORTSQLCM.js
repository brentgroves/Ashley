
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
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
var sql3Done=false;
var sql3Cnt=0;
var sql3Failed=false;
var contPORT=false;
const ATTEMPTS=1;



export async function sql1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 
  if ('development'==process.env.NODE_ENV) {
    console.dir(state);
  }

  var cnt=0;
  init();
  execSQL1(dispatch);
  execSQL2(dispatch);
  execSQL3(dispatch);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLCM.sql1() Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLCM..sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLCM..sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLCM..sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLCM..sql1(): Suceeded`)
    }
  }


}

function init(){
  sql1Done=false; 
  sql1Cnt=0;  
  sql1Failed=false;
  sql2Done=false;
  sql2Cnt=0;
  sql2Failed=false;
  sql3Done=false;
  sql3Cnt=0;
  sql3Failed=false;
  contPORT=false;
}

export function isDone(){
  if(
    (true==sql1Done) &&
    (true==sql2Done) &&
    (true==sql3Done) 
    )
  {
    return true;
  } else{
    return false;
  }
}

export function didFail(){
  if(
    (true==sql1Failed) ||
    (true==sql2Failed) ||
    (true==sql3Failed)
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


function execSQL1(disp){
  var dispatch=disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQLCM.execSQL1() top=>${sql1Cnt}`);
  }

  var cribConnection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLCM.execSQL1() Connection Sucess`);
      }
      // Query
      var request = new sql.Request(cribConnection); // or: var request = connection1.request();
      request.query(
      `
        select UDF_POCATEGORY,RTrim(UDF_POCATEGORYDescription) descr from UDT_POCATEGORY
      `, function(err, recordset) {
          if(null==err){
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLCM.execSQL1() Query Sucess`);
            }
            var allCats=[];
            var catRecs=[];
            recordset.forEach(function(pocat,i,arr){
              if ('development'==process.env.NODE_ENV) {
                console.dir(pocat.descr);
              }
              allCats.push(pocat.descr);
              catRecs.push({UDF_POCATEGORY:pocat.UDF_POCATEGORY, descr:pocat.descr});
            });
            dispatch({ type:PORTACTION.SET_PO_CATEGORIES, catTypes:allCats });
            dispatch({ type:PORTACTION.SET_PO_CAT_RECORDS, catRecs:catRecs });
            sql1Done=true;
          }else{
            if(++sql1Cnt<ATTEMPTS) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`PORTSQLCM.execSQL1().query:  ${err.message}` );
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
          console.log(`PORTSQLCM.execSQL1().Connection:  ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        sql1Failed=true;
      }
    }
  });
  
  cribConnection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLCM.execSQL1().cribConnection.on('error', function(err):  ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}

function execSQL2(disp){
  var dispatch=disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQLCM.execSQL2() top=>${sql2Cnt}`);
  }


  var cribConnection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLCM.execSQL2() Connection Sucess`);
      }
      let qry;
      if (MISC.PROD===true) {
        qry = `
        select VendorNumber,VendorName,PurchaseAddress1,PurchaseAddress2,PurchaseCity,PurchaseState,PurchaseZip,
        rtrim(VendorName)  +
        case 
          when PurchaseCity is null then '' 
          else ' - ' + rtrim(PurchaseCity)
        end + ' - ' + 
        rtrim(VendorNumber) 
        as Description
        from vendor 
        where VendorName is not NULL
        order by VendorName
        `;
      }else{
        qry = `
        select VendorNumber,VendorName,PurchaseAddress1,PurchaseAddress2,PurchaseCity,PurchaseState,PurchaseZip,
        rtrim(VendorName)  +
        case 
          when PurchaseCity is null then '' 
          else ' - ' + rtrim(PurchaseCity)
        end + ' - ' + 
        rtrim(VendorNumber) 
        as Description
        from btVendor 
        where VendorName is not NULL
        order by VendorName
        `;
      }
      var request = new sql.Request(cribConnection); // or: var request = connection1.request();
      request.query(qry,
        function(err, recordset) {
          if(null==err){
            // ... error checks
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLCM.execSQL2() Query Sucess`);
              console.dir(recordset);
            }
            var vendorSelect=[];
            recordset.forEach(function(vendor,i,arr){
              vendorSelect.push(vendor.Description);
            });
            dispatch({ type:PORTACTION.SET_VENDORS, vendors:recordset });
            dispatch({ type:PORTACTION.SET_VENDOR_SELECT, vendorSelect:vendorSelect });
            sql2Done=true;
          }else{
            if(++sql2Cnt<ATTEMPTS) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`PORTSQLCM.execSQL2().query:  ${err.message}` );
                console.log(`sql2Cnt = ${sql2Cnt}`);
              }
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              sql2Failed=true;
            }
          }
        }
      );
    }else{
      if(++sql2Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLCM.execSQL2().Connection:  ${err.message}` );
          console.log(`sql2Cnt = ${sql2Cnt}`);
        }
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        sql2Failed=true;
      }
    }
  });
  
  cribConnection.on('error', function(err) {
    if(++sql2Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLCM.execSQL2().cribConnection.on('error', function(err):  ${err.message}` );
        console.log(`sql2Cnt = ${sql2Cnt}`);
      }
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql2Failed=true;
    }
  });
}



function execSQL3(disp){
  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQLCM.execSQL3() top=>${sql3Cnt}`);
  }
  var dispatch=disp;

  var cribConnection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLCM.execSQL3() Connection Sucess`);
      }
      let qry;
      // SAME QUERY SINCE btapvend created by SSIS script
      if (MISC.PROD===true) {
        qry = `
          select fvendno,fcterms,fccompany,
          fccity,fcstate,fczip,fccountry,fcphone,fcfax,fmstreet,
          vendorSelect
          FROM btapvend
          order by vendorSelect
          `;
      }else{
        qry = `
          select fvendno,fcterms,fccompany,
          fccity,fcstate,fczip,fccountry,fcphone,fcfax,fmstreet,
          vendorSelect
          FROM btapvend
          order by vendorSelect
          `;
      }

      // Query
      var request = new sql.Request(cribConnection); 
      request.query(qry
      , function(err, recordset) {
          if(null==err){
            // ... error checks
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLCM.execSQL3() Query Sucess`);
            }
            var vendorSelect=[];
            recordset.forEach(function(vendor,i,arr){
              vendorSelect.push(vendor.vendorSelect);
            });
            dispatch({ type:PORTACTION.SET_M2M_VENDOR_SELECT, m2mVendorSelect:vendorSelect });
            dispatch({ type:PORTACTION.SET_M2M_VENDORS, m2mVendors:recordset });
            sql3Done=true;
            contPORT=true;
          }else{
            if(++sql3Cnt<ATTEMPTS) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`PORTSQLCM.execSQL3().query:  ${err.message}` );
                console.log(`sql3Cnt = ${sql3Cnt}`);
              }
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              sql3Failed=true;
            }
          }
        }
      );
    }else{
      if(++sql3Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLCM.execSQL3().Connection:  ${err.message}` );
          console.log(`sql3Cnt = ${sql3Cnt}`);
        }
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        sql3Failed=true;
      }
    }
  });
  
  cribConnection.on('error', function(err) {
    if(++sql3Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLCM.execSQL3().cribConnection.on():  ${err.message}` );
        console.log(`sql3Cnt = ${sql3Cnt}`);
      }
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql3Failed=true;
    }
  });
}

