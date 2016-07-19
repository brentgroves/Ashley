import {RETRIEVE_PO,SET_POLIST} from '../actions/po';
//import sql from 'mssql';
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var poList;
export default function PODispatch( state = [{}], action) {
 // 	getPO();
  switch (action.type) {
    case RETRIEVE_PO:
    {
    	console.log('start getPO');
      poList = state;
    	getPO();
    	return state;
    }
    case SET_POLIST:
    {
        console.log('update poList');
        Object.assign({}, state, action.poList);      
      return state;
    }
    default:
      return state;
  }
}


function getPO() {
	var config = {
	    userName: 'sa',
	    password: 'buschecnc1',
	    server: '192.168.1.106',
//      server: '10.1.2.17',
	    options: {encrypt: false, database: 'cribmaster',instanceName: 'SQLEXPRESS'}  
//      options: {encrypt: false, database: 'cribmaster'}  

	};
	var connection = new Connection(config);
	connection.on('connect', function(err) {
	     //Add error handling here   
	     getSqlData();
	    }
	);
	var rows = [];
	function getSqlData() {
	    console.log('Getting data from SQL');
	    var request = new Request(
        `
          SELECT po.PONumber,po.Vendor,po.Address1
          FROM [btVENDOR] vn
          right outer join
          (
            SELECT PONumber,vendor,address1
            FROM [btPO]
            WHERE [btPO].POSTATUSNO = 3 and [btPO].SITEID <> '90'
          )po
          on vn.VendorNumber=po.Vendor
          where vn.VendorNumber = 2
        `,
//        "SELECT PONumber,VendorPO FROM PO where PONumber = 24960",
//      var request = new Request("SELECT PONumber,VendorPO FROM PO where vendorPO = 118500",
	        function(err, rowCount) {
  	        if (err) {
  	            console.log(err);
  	        } else {
  	            console.log('success: ' + rowCount);
  	        }
  	       });
	    request.on('row', function(columns) {
	        var row = {};
	        columns.forEach(function(column) {
	            row[column.metadata.colName] = column.value;
	         //   state = column.value;
		        console.log(column.value);
	        });
	        rows.push(row);

	    });

	    request.on('doneProc', function(more) {  
        poList = rows;
	    	console.log(this.rowCount + ' rows returned'); 
	    	

	    });  

	    connection.execSql(request);
	}
}
/*
function getPO() {

	console.log('start getPO');
    var Connection = require('tedious').Connection;  
    var config = {  
        userName: 'sa',  
        password: 'buschecnc1',  
        server: '10.1.2.17',  
        // If you are on Microsoft Azure, you need this:  
        options: {encrypt: true, database: 'cribmaster'}  
    };  
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Connected");  
        executeStatement();  
    });  

    var Request = require('tedious').Request;  
    var TYPES = require('tedious').TYPES;  
  
    function executeStatement() {  
        request = new Request(
        	"SELECT PONumber,VendorPO FROM [dbo].[PO] where vendorPO = 118500", function(err) { 
//        	"SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;", function(err) {  
        if (err) {  
            console.log(err);}  
        });  
        var result = "";  
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result+= column.value + " ";  
              }  
            });  
            console.log(result);  
            result ="";  
        });  
  
        request.on('done', function(rowCount, more) {  
        console.log(rowCount + ' rows returned');  
        });  
        connection.execSql(request);  
    }
}  

var crib = {
    user: 'sa',
    password: 'buschecnc1',
    server: 'busche-sql', // You can use 'localhost\\instance' to connect to named instance
    database: 'cribmaster'
}

*/
/*
function getPO() {
  var cribConnection = new sql.Connection(crib,function(err){
    // error checks
    poCatChk(cribConnection);
  });
  cribConnection.on('error', function(err) {
    console.log(`Connection1 err:  ${err}` );
    // ... error handler
  });
} // poUpdate


//**CHECK IF ALL PO CATEGORIES HAVE BEEN SELECTED
var poCatChk = function (cribConnection) {
  let qryCrib;
  if (prod===true) {
    qryCrib = `
      SELECT PONumber,Item,UDF_POCATEGORY
      FROM PODETAIL
      WHERE PONUMBER in
      (
        SELECT ponumber FROM [PO]  WHERE [PO].POSTATUSNO = 3 and [PO].SITEID <> '90'
      )
      and UDF_POCATEGORY is null
    `;
  }else{
    qryCrib = `
      SELECT PONumber,Item,UDF_POCATEGORY
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
//      document.getElementById('errContents').innerHTML = cribRsErr;
      console.log("Failed PO category check.");
 //     document.getElementById('msgToUsr').innerHTML += `<div class="failed">Failed Cribmaster PO category check.</div>`;
      dialog.showMessageBox({ message:
        `Failed PO category check:\nNo Cribmaster PO category is selected on the following PO(s):\n${cribRsErr}\n\nFix issue then click PO Update.`,
        buttons: ["OK"] });
    }else {
      console.log("Passed PO category check.");
//      document.getElementById('msgToUsr').innerHTML = `<div class="passed">Passed Cribmaster PO category check.</div>`;
//      poVendorChk(cribConnection);
    }
  });
}


*/

