
var sql = require('mssql');
const {dialog} = require('electron').remote;
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CM from "./PORTSQLCM.js"
import * as M2M from "./PORTSQLM2M.js"
import * as CHECK1 from "./PORTSQLCheck1.js"
import * as CHECK2 from "./PORTSQLCheck2.js"
import * as CHECK3 from "./PORTSQLCheck3.js"
import * as UPDATE1 from "./PORTSQLUpdate1.js"
import * as UPDATE2 from "./PORTSQLUpdate2.js"
import * as MISC from "./Misc.js"

var m2m = {
  user: 'sa',
  password: 'buschecnc1',
//  server: '192.168.1.113', // You can use 'localhost\\instance' to connect to named instance
  server: '10.1.2.19',//   server: 'busche-sql-1', // You can use 'localhost\\instance' to connect to named instance
  database: 'm2mdata01',
  port: 1433,
//    debug: true,
  options: {
      encrypt: false // Use this if you're on Windows Azure
     // ,instanceName: 'SQLEXPRESS'
  },
  requestTimeout: 60000

}

var m2mCheck = {
  user: 'sa',
  password: 'buschecnc1',
//  server: '192.168.1.113', // You can use 'localhost\\instance' to connect to named instance
  server: '10.1.2.19',//   server: 'busche-sql-1', // You can use 'localhost\\instance' to connect to named instance
  database: 'm2mdata01',
  port: 1433,
//    debug: true,
  options: {
      encrypt: false // Use this if you're on Windows Azure
     // ,instanceName: 'SQLEXPRESS'
  }
}

var crib = {
 user: 'sa',
  password: 'buschecnc1',
//  server: '192.168.1.113', // You can use 'localhost\\instance' to connect to named instance
  server: '10.1.2.17',//   server: 'busche-sql-1', // You can use 'localhost\\instance' to connect to named instance
  options: {
    database: 'Cribmaster',
    port: 1433 // Use this if you're on Windows Azure
     // ,instanceName: 'SQLEXPRESS'
  },
  requestTimeout: 60000
}

var cribCheck = {
 user: 'sa',
  password: 'buschecnc1',
//  server: '192.168.1.113', // You can use 'localhost\\instance' to connect to named instance
  server: '10.1.2.17',//   server: 'busche-sql-1', // You can use 'localhost\\instance' to connect to named instance
  options: {
    database: 'Cribmaster',
    port: 1433 // Use this if you're on Windows Azure
     // ,instanceName: 'SQLEXPRESS'
  }
}

/* home
var crib = {
  user: 'sa',
  password: 'buschecnc1',
//  server: '192.168.1.113',
  server: '10.1.2.17', //   server: 'busche-sql', // You can use 'localhost\\instance' to connect to named instance
  database: 'cribmaster',
  port: 1433,
  //    debug: true,

  requestTimeout: 60000,
  options: {
      encrypt: false // Use this if you're on Windows Azure
      //,instanceName: 'SQLEXPRESS'
  }

}
*/
var prod=false;
var errors=false;
var primed=false;
var primeFailed=false;
var m2mConnectCnt=0;
var cribConnectCnt=0;

export async function primeDB(disp,stateUpdate){
  var dispatch=disp;
  var updateState=stateUpdate;
  var cnt=0;
  console.log(`primeDB top`);
  initPrime();
  // FIRST CONNECT ALWAYS FAILS IN DEVELOPER MODE
  cribConnect(dispatch,updateState);
  m2mConnect(dispatch,updateState);
  m2mConnect(dispatch,updateState);
  m2mConnect(dispatch,updateState);
  m2mConnect(dispatch,updateState);

  while(!isPrimed() && !primeFailed){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`primeDB(disp) Cannot Connection` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isPrimed()){
    dispatch({ type:PORTACTION.SET_PRIMED, primed:true });
    if(updateState){
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.PRIMED });
    }
  }

}

function initPrime(){
  primed=false;
  primeFailed=false;
  m2mConnectCnt=0;
  cribConnectCnt=0;
}

function isPrimed(){
  if(true==primed){
    return true;
  } else{
    return false;
  }
}

/*function isPrimed(){
  if((true==m2mPrimed)&(true==cribPrimed)){
    return true;
  } else{
    return false;
  }
}
*/
function cribConnect(disp,updateState){
  var dispatch=disp;
  console.log(`cribConnectCnt = ${cribConnectCnt}`);

  var cribConnection = new sql.Connection(cribCheck, function(err) {
    // ... error checks
    if(null==err){
      console.dir(cribConnection);
      // Query

      var request = new sql.Request(cribConnection); // or: var request = connection1.request();
      request.query(
      `
        select * from po where ponumber = 25619
      `, function(err, recordset) {
          if(null==err){
            // ... error checks
            console.log(`crib query`);
            console.dir(recordset);
            primed=true;
          }else{
            if(++cribConnectCnt<3) {
              console.log(`cribConnect.query:  ${err.message}` );
              console.log(`cribConnectCnt = ${cribConnectCnt}`);
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              primeFailed=true;
            }
          }
        }
      );
    }else{
      if(++cribConnectCnt<3) {
        console.log(`cribConnect.Connection:  ${err.message}` );
        console.log(`cribConnectCnt = ${cribConnectCnt}`);
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        primeFailed=true;
      }
    }
  });
  
  cribConnection.on('error', function(err) {
    if(++cribConnectCnt<3) {
      console.log(`cribConnect.on('error', function(err):  ${err.message}` );
      console.log(`cribConnectCnt = ${cribConnectCnt}`);
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      primeFailed=true;
    }
  });
}

function m2mConnect(disp,updateState){
  var dispatch=disp;
  console.log(`m2mConnectCnt = ${m2mConnectCnt}`);

  var m2mConnection = new sql.Connection(m2mCheck, function(err) {
    // ... error checks
    if(null==err){
      console.dir(m2mConnection);
      var request = new sql.Request(m2mConnection); 
      request.query(
        `
          select fvendno, fcompany
          FROM apvend 
          where fvendno = '002946'
        `,function(err, recordset) {
            // ... error checks
            if(null==err){
              console.log(`m2mConnect: query success`);
              console.dir(recordset);
              primed=true;
            }else{
              if(++m2mConnectCnt<3) {
                console.log(`m2mConnect.query:  ${err.message}` );
                console.log(`m2mConnectCnt = ${m2mConnectCnt}`);
              }else{
                dispatch({ type:PORTACTION.SET_REASON, state:err.message });
                dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
                primeFailed=true;
              }
            }
          }
      );
    }else{
      if(++m2mConnectCnt<3) {
        console.log(`m2mConnect.Connection:  ${err.message}` );
        console.log(`m2mConnectCnt = ${m2mConnectCnt}`);
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        primeFailed=true;
      }

    }
  });
  
  m2mConnection.on('error', function(err) {
    if(++m2mConnectCnt<3) {
      console.log(`m2mConnect.on('error', function(err):  ${err.message}` );
      console.log(`m2mConnectCnt = ${m2mConnectCnt}`);
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      primeFailed=true;
    }
  });
}

export async function updateCheck1(disp,getSt,poNumber,item,poCategory,startPort) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 
  var cnt=0;
  console.log(`updateCheck1(disp,getSt,poNumber,item,poCategory): top`);
  console.dir(portState);
  console.dir(startPort);

  UPDATE1.sql1(dispatch,getState,poNumber,item,poCategory);

  cnt=0;

  while(!UPDATE1.isDone())
  {
    if(++cnt>15 || UPDATE1.didFail()){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(UPDATE1.isDone() && !UPDATE1.didFail()){
    startPort();
/*    dispatch((dispatch,getState) => {
        var disp = dispatch;
        var getSt = getState;
        POReqTrans(disp,getSt);
      }
    );
*/  }
} // updateCheck1

export async function updateCheck2(disp,getSt,poNumber,vendorNumber,startPort) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 
  var cnt=0;
  console.log(`updateCheck2(): top`);
  console.dir(portState);
  console.dir(startPort);

  UPDATE2.sql1(dispatch,getState,poNumber,vendorNumber);

  cnt=0;

  while(!UPDATE2.isDone())
  {
    if(++cnt>15 || UPDATE2.didFail()){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(UPDATE2.isDone() && !UPDATE2.didFail()){
    startPort();
/*    dispatch((dispatch,getState) => {
        var disp = dispatch;
        var getSt = getState;
        POReqTrans(disp,getSt);
      }
    );
*/  }
} // updateCheck2



export default async function POReqTrans(disp,getSt) {
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var portState = getState(); 

  var continueChecks=true;
  var cnt=0;
  initPrime();
  primeDB(dispatch,false);

  console.dir(portState);

  while(!isPrimed() && !primeFailed){
    if(++cnt>15){
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(!isPrimed()){
    // Exit if Not Primed
    return;
  }


  dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STARTED });

  CM.portCribQueries(dispatch);
  M2M.portM2mQueries(dispatch);

  cnt=0;

  while(!CM.arePortQueriesDone() || !M2M.arePortQueriesDone())
  {
    if(++cnt>15 || CM.didPortQueriesFail() || M2M.didPortQueriesFail()){
      continueChecks=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }


  if(continueChecks){
    console.log(`Async Crib & M2m queries are complete.`);
    CHECK1.portCheck1(dispatch)
  }else{
    console.log(`Async Crib & M2m queries FAILED.`);
  }

// CHECK#1
  cnt=0;

  while(continueChecks && !CHECK1.isPortCheck1Done()){
    if(++cnt>15 || CHECK1.didCheckFail()){
      continueChecks=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueChecks && CHECK1.continueChecks()){
    console.log(`portCheck1 complete continue Checks.`);
    CHECK2.portCheck2(dispatch)
  }

// CHECK#2
  cnt=0;

  while(continueChecks && !CHECK2.isPortCheck2Done()){
    if(++cnt>15 || CHECK2.didCheckFail()){
      continueChecks=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }


  if(continueChecks && CHECK1.continueChecks() && CHECK2.continueChecks()){
    console.log(`portCheck2 complete continue Checks.`);
    CHECK3.portCheck(dispatch,getState)
  }


// CHECK#3
  cnt=0;

  while(continueChecks && !CHECK3.isPortCheckDone()){
    if(++cnt>15 || CHECK3.didCheckFail()){
      continueChecks=false;
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(continueChecks && CHECK1.continueChecks() && CHECK2.continueChecks() && CHECK3.continueChecks()){
    console.log(`portCheck3 complete continue Checks.`);
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.SUCCESS });
 }

 
} // poUpdate




/********************CHECK IF ALL PO CATEGORIES HAVE BEEN SELECTED FOR EACH PO ITEM & THE RECORDS ARE NOT LOCKED****************/

function  poCatChk(disp,cribConnection) {
  var cribConnect=cribConnection;
  var dispatch=disp;
  let qryChk1;
  if (prod===true) {
    qryChk1 = `
      SELECT ROW_NUMBER() OVER(ORDER BY PONumber, Item) id,PONumber,RTrim(Item) Item,RTrim(ItemDescription) ItemDescription,RTrim(UDF_POCATEGORY) UDF_POCATEGORY
      FROM PODETAIL
      WHERE PONUMBER in
      (
        SELECT ponumber FROM [PO]  WHERE [PO].POSTATUSNO = 3 and [PO].SITEID <> '90'
      )
      and UDF_POCATEGORY is null
    `;
  }else{
    qryChk1 = `
      SELECT ROW_NUMBER() OVER(ORDER BY PONumber, Item) id,PONumber,RTrim(Item) Item,RTrim(ItemDescription) ItemDescription,RTrim(UDF_POCATEGORY) UDF_POCATEGORY
      FROM btPODETAIL
      WHERE PONUMBER in
      (
        SELECT ponumber FROM [btPO]  WHERE [btPO].POSTATUSNO = 3 and [btPO].SITEID <> '90'
      )
      and UDF_POCATEGORY is null
    `;
  }

  new sql.Request(cribConnect)
  .query(qryChk1).then(function(recordset) {
    if(recordset.length!==0){
      let cribRsErr ="";
      recordset.forEach(function(podetail,i,arr){
        console.log(podetail.Item);
        if(arr.length===i+1){
          cribRsErr+=`PO# ${podetail.PONumber}, Item: ${podetail.Item}`;
        }else{
          cribRsErr+= `PO# ${podetail.PONumber}, Item: ${podetail.Item}\n`;
        }
      });
      console.log("Failed PO category check.");
      dispatch({ type:PORTACTION.SET_NO_CAT_LIST, noCatList:recordset });
      dispatch({ type:PORTACTION.SET_CHECK1, chk1:PORTCHK.FAILURE });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_10_FAIL });
    }else {
      dispatch({ type:PORTACTION.SET_CHECK1, chk1:PORTCHK.SUCCESS });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_10_PASS });
      getVendors(dispatch,cribConnect);
    }
  }).catch(function(err) {
    console.log(`POReqTran NO PO category query err:  ${err.message}` );
    dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
  });
}

function getVendors(disp,cribConnection) {
  var dispatch=disp;
  var cribConnect=cribConnection;
  let qryCrib = `
    select VendorNumber,
    rtrim(VendorName)  +
    case 
      when PurchaseCity is null then 'unknown' 
      else ' - ' + rtrim(PurchaseCity)
    end + ' - ' + 
    rtrim(VendorNumber) 
    as Description
    from vendor 
    where VendorName is not NULL
    order by VendorName
  `;

  // Vendor query
  new sql.Request(cribConnect)
  .query(qryCrib).then(function(recordset) {
      dispatch({ type:PORTACTION.SET_VENDORS, vendors:recordset });
      getVendorSelect(dispatch,cribConnect);
  }).catch(function(err) {
    console.log(`POReqTran Vendor query err:  ${err.message}` );
    dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
  });
}

function getVendorSelect(disp,cribConnection) {
  var dispatch=disp;
  var cribConnect=cribConnection;
  let qryCrib = `
    select 
    rtrim(VendorName)  +
    case 
      when PurchaseCity is null then 'unknown' 
      else ' - ' + rtrim(PurchaseCity)
    end + ' - ' + 
    rtrim(VendorNumber) 
    as Description
    from vendor 
    where VendorName is not NULL
    order by VendorName
  `;

  // Vendor query
  new sql.Request(cribConnect)
  .query(qryCrib).then(function(recordset) {
    if(recordset.length!==0){
      console.log("VendorSelect retrieved.");
      var vendorSelect=[];
      recordset.forEach(function(vendor,i,arr){
        vendorSelect.push(vendor.Description);
      });
      dispatch({ type:PORTACTION.SET_VENDOR_SELECT, vendorSelect:vendorSelect });
      portCheck2(dispatch,cribConnect);
    }
  }).catch(function(err) {
    console.log(`POReqTran Vendor Select query err:  ${err.message}` );
    dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
  });
}

/*******************CHECK IF PO HAS A VALID VENDOR IN CRIBMASTER****************/

function  portCheck2(disp,cribConnection) {
//    var that = this;
  var dispatch = disp;
  var cribConnect=cribConnection;
  let qryChk2;
  if (prod===true) {
    qryChk2 = `
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
    qryChk2 = `
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

  new sql.Request(cribConnect)
  .query(qryChk2).then(function(recordset) {
      console.log("portCheck2 query done");
      // error checks
      if(recordset.length!==0){
        console.log("portCheck2 query had records.");
        dispatch({ type:PORTACTION.SET_CHECK2, chk2:PORTCHK.FAILURE });
        dispatch({ type: PORTACTION.SET_NO_CRIB_VEN, noCribVen:recordset });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_20_FAIL});
      }else {
        dispatch({ type:PORTACTION.SET_CHECK2, chk2:PORTCHK.SUCCESS});
        startCheck3(dispatch);
      }
  }).catch(function(err) {
    console.log(`portCheck2 query err:  ${err.message}` );
    dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
  });
}



function startCheck3(disp) {
//  var that = this;
  var dispatch = disp;
  console.log("startCheck3 top");
  var m2mConnect=sql.connect(m2m).then(function() {
    getM2mVendors(dispatch,m2mConnect);
  }).catch(function(err) {
    console.log(`m2mConnect err:  ${err.message}` );
    dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
  });
} 

function getM2mVendors(disp,m2mConnection) {
  var dispatch=disp;
  var m2mConnect=m2mConnection;
  let qryM2m = `
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
  `;

  console.log("getM2mVendors top");

  // Vendor query
  new sql.Request(m2mConnect)
  .query(qryM2m).then(function(recordset) {
      console.log("getM2mVendors query success");
      dispatch({ type:PORTACTION.SET_M2M_VENDORS, m2mVendors:recordset });
      getM2mVendorSelect(dispatch,m2mConnect);
  }).catch(function(err) {
    console.log(`getM2mVendor query err:  ${err.message}` );
    dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
  });
}

function getM2mVendorSelect(disp,m2mConnection){
  var dispatch=disp;
  var m2mConnect=m2mConnection;
  let qryM2m = `
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
  `;

  // Vendor query
  new sql.Request(m2mConnect)
  .query(qryM2m).then(function(recordset) {
    if(recordset.length!==0){
      console.log("getM2mVendorSelect query success");
      var m2mVendorSelect=[];
      recordset.forEach(function(vendor,i,arr){
        m2mVendorSelect.push(vendor.vendorSelect);
      });
      dispatch({ type:PORTACTION.SET_M2M_VENDOR_SELECT, m2mVendorSelect:m2mVendorSelect });
      portCheck3(dispatch);
    }
  }).catch(function(err) {
    console.log(`getM2mVendorSelect query err:  ${err.message}` );
    dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
  });
}

/*******************CHECK IF PO HAS A VALID VENDOR IN M2M****************/

async function  portCheck3(disp) {
//    var that = this;
  var dispatch = disp;
  var cnt=0;
/*  initPrime();
  primeDB(dispatch,false);

  while(!isPrimed() && !primeFailed){
    if(++cnt>15){
      break;
    }else{
      await sleep(2000);
    }
  }

  if(!isPrimed()){
    console.log(`cribConnect err:  ${err.message}` );
    dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });

    // Exit if Not Primed
    return;
  }
*/
  let qryCrib;
  if (prod===true) {
    qryCrib = `
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
    qryCrib = `
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
  console.dir(cmConnect);
  new sql.Request(cmConnect)
  .query(qryCrib).then(function(recordset) {
      console.log("portCheck3 query done");
      // error checks
      if(recordset.length!==0){
        console.log("portCheck3 query had records.");
        dispatch({ type:PORTACTION.SET_CHECK3, chk3:PORTCHK.FAILURE });
        dispatch({ type: PORTACTION.SET_NO_M2M_VEN, noM2mVen:recordset });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_30_FAIL});
      }else {
        dispatch({ type:PORTACTION.SET_CHECK3, chk3:PORTCHK.SUCCESS});
        dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:'success' });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.SUCCESS });
      }
  }).catch(function(err) {
    console.log(`portCheck3 query err:  ${err.message}` );
    dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
    dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
  });
} 


//export default POReqTrans;
///export fetchPOCategories;