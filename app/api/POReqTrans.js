
var sql = require('mssql');
const {dialog} = require('electron').remote;
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"

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
export function linuxSQLPrime(){
  console.log('start of linuxSQLPrime');

  var cribConnection = new sql.Connection(crib,function(err){
    // error checks
    console.log('Connection created');
  });
  cribConnection.on('error', function(err) {
    console.log(`Connection1 err:  ${err}` );
    // ... error handler
  });
}



export function updateCheck1(dispatch,poNumber,item,poCategory) {
//  var that = this;
  var disp = dispatch;
  var cribConnection = new sql.Connection(crib,function(err){
    // error checks
    updChk1(disp,cribConnection,poNumber,item,poCategory);
  });
  cribConnection.on('error', function(err) {
    console.log(`Connection1 err:  ${err}` );
    // ... error handler
  });
} // poUpdate

function  updChk1(disp,cribConnection,poNumber,item,poCategory) {
//    var that = this;
    var dispatch = disp;
    let qryCrib;
    if (prod===true) {
      qryCrib = `
        update PODETAIL
        set UDF_POCATEGORY = ${poCategory}
        where 
        PONumber = ${poNumber} and Item = ${item}
      `;
    }else{
      qryCrib = `
        update btPODETAIL
        set UDF_POCATEGORY = ${poCategory}
        where 
        PONumber = ${poNumber} and Item = ${item}
      `;
    }

    let cribReq = new sql.Request(cribConnection);

    cribReq.query(qryCrib, function(err,cribRs) {
      // error checks
      console.dir(err);
      console.dir(cribRs);
      POReqTrans(dispatch);
    });
  }



export default function POReqTrans(dispatch) {
//  var that = this;
  var disp = dispatch;

 // linuxSQLPrime();
  //dispatch({ type:PORTACTION.INIT_PORT});

  var cribConnection = new sql.Connection(crib,function(err){
    // error checks
    getAllCats(disp,cribConnection);
  });
  cribConnection.on('error', function(err) {
    console.log(`Connection1 err:  ${err}` );
    // ... error handler
  });
} // poUpdate

function  getAllCats(disp,cribConnection) {
  var dispatch = disp;
  let qryCrib = `
    select UDF_POCATEGORY,RTrim(UDF_POCATEGORYDescription) descr from UDT_POCATEGORY
  `;

  console.log('start of poCategories');


  let cribReq = new sql.Request(cribConnection);

  cribReq.query(qryCrib, function(err,cribRs) {
 //   console.log(`PO category query done. ${err}`);
    // error checks
    console.dir(err);
    
    if(cribRs.length!==0){
      console.log("PO category retrieved.");
      var allCats=[];
      var catRecs=[];
      var cribRsLog;
      cribRs.forEach(function(pocat,i,arr){
        console.log(pocat.descr);
        if(arr.length===i+1){
          cribRsLog+=`UDF_POCATEGORY# ${pocat.UDF_POCATEGORY}, descr: ${pocat.descr}`;
        }else{
          cribRsLog+=`UDF_POCATEGORY# ${pocat.UDF_POCATEGORY}, descr: ${pocat.descr}\n`;
        }
        allCats.push(pocat.descr);
        catRecs.push({UDF_POCATEGORY:pocat.UDF_POCATEGORY, descr:pocat.descr});
      });
      dispatch({ type:PORTACTION.SET_PO_CATEGORIES, catTypes:allCats });
      dispatch({ type:PORTACTION.SET_PO_CAT_RECORDS, catRecs:catRecs });
      poCatChk(dispatch,cribConnection);

    }
  });
}

/********************CHECK IF ALL PO CATEGORIES HAVE BEEN SELECTED FOR EACH PO ITEM & THE RECORDS ARE NOT LOCKED****************/

function  poCatChk(disp,cribConnection) {
//    var that = this;
    var dispatch = disp;
    let qryCrib;
    if (prod===true) {
      qryCrib = `
        SELECT ROW_NUMBER() OVER(ORDER BY PONumber, Item) id,PONumber,RTrim(Item) Item,RTrim(ItemDescription) ItemDescription,RTrim(UDF_POCATEGORY) UDF_POCATEGORY
        FROM PODETAIL
        WHERE PONUMBER in
        (
          SELECT ponumber FROM [PO]  WHERE [PO].POSTATUSNO = 3 and [PO].SITEID <> '90'
        )
        and UDF_POCATEGORY is null
      `;
    }else{
      qryCrib = `
        SELECT ROW_NUMBER() OVER(ORDER BY PONumber, Item) id,PONumber,RTrim(Item) Item,RTrim(ItemDescription) ItemDescription,RTrim(UDF_POCATEGORY) UDF_POCATEGORY
        FROM btPODETAIL
        WHERE PONUMBER in
        (
          SELECT ponumber FROM [btPO]  WHERE [btPO].POSTATUSNO = 3 and [btPO].SITEID <> '90'
        )
        and UDF_POCATEGORY is null
      `;
    }

    let cribReq = new sql.Request(cribConnection);

    cribReq.query(qryCrib, function(err,cribRs) {
      // error checks
      if(cribRs.length!==0){
        let cribRsErr ="";
        cribRs.forEach(function(podetail,i,arr){
          console.log(podetail.Item);
          if(arr.length===i+1){
            cribRsErr+=`PO# ${podetail.PONumber}, Item: ${podetail.Item}`;
          }else{
            cribRsErr+= `PO# ${podetail.PONumber}, Item: ${podetail.Item}\n`;
          }
        });
        console.log("Failed PO category check.");
        dispatch({ type:PORTACTION.SET_CHECK1, chk1:'failure' });
//        dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:'error' });
        dispatch({ type:PORTACTION.SET_NO_CAT_LIST, noCatList:cribRs });

  //       let page = 1
  //       that.setState({
  //           results: cribRs,
  //           currentPage: page-1,
  //           maxPages: 1
  // //          maxPages: Math.round(data.count/10)S
  //         })
          //        that.props.setCheck1('failure');
      }else {
        dispatch({ type:PORTACTION.SET_CHECK1, chk1:'success' });
        // crib connection gets closed if check1 failed prev
        portCheck2(dispatch);
      }
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.IN_PROGRESS });
    });
  }

function portCheck2(dispatch) {
//  var that = this;
  var disp = dispatch;

 // linuxSQLPrime();
  console.log("portCheck2 stated")
  var cribConnection = new sql.Connection(crib,function(err){
    // error checks
    console.log("portCheck2 Connection made")
    portChk2(disp,cribConnection);
  });
  cribConnection.on('error', function(err) {
    console.log(`Connection2 err:  ${err}` );
    // ... error handler
  });
} // poUpdate

/*******************CHECK IF PO HAS A VALID VENDOR IN CRIBMASTER****************/

function  portChk2(disp,cribConnection) {
//    var that = this;
    var dispatch = disp;
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

    let cribReq = new sql.Request(cribConnection);

    cribReq.query(qryCrib, function(err,cribRs) {
      console.log("portCheck2 query done");

      // error checks
      if(cribRs.length!==0){
        let cribRsErr ="";
        cribRs.forEach(function(podetail,i,arr){
          console.log(podetail.Item);
          if(arr.length===i+1){
            cribRsErr+=`PO# ${podetail.PONumber}, Item: ${podetail.Item}`;
          }else{
            cribRsErr+= `PO# ${podetail.PONumber}, Item: ${podetail.Item}\n`;
          }
        });
        console.log("portCheck2 query had records.");
        dispatch({ type:PORTACTION.SET_CHECK2, chk2:'failure' });

        dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:'error' });
        dispatch({ type: PORTACTION.SET_NO_CRIB_VEN, noCribVen:cribRs });

  //       let page = 1
  //       that.setState({
  //           results: cribRs,
  //           currentPage: page-1,
  //           maxPages: 1
  // //          maxPages: Math.round(data.count/10)S
  //         })
          //        that.props.setCheck1('failure');
      }else {
        dispatch({ type: PORTACTION.SET_CHECK2, chk2:'success' });
        dispatch({ type:PORTACTION.SET_GO_BUTTON, goButton:'success' });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.SUCCESS });
      }
    });
  }


//export default POReqTrans;
///export fetchPOCategories;