import {RETRIEVE_PO} from '../actions/po';
import sql from 'mssql';
require('mssql/lib/tedious'); 


var crib = {
    user: 'sa',
    password: 'buschecnc1',
    server: 'busche-sql', // You can use 'localhost\\instance' to connect to named instance
    database: 'cribmaster'
}

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




export default function retrievePO(state = 0, action) {
  switch (action.type) {
    case RETRIEVE_PO:
      return getPO();
    default:
      return state;
  }
}
