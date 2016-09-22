
var sql = require('mssql');
const {dialog} = require('electron').remote;
import {SET_PO_CATEGORIES,SET_NO_CAT_LIST} from '../actions/POReqTrans';

var m2m = {
  user: 'sa',
  password: 'buschecnc1',
  server: '192.168.1.113', // You can use 'localhost\\instance' to connect to named instance
//  server: '10.1.2.19',//   server: 'busche-sql-1', // You can use 'localhost\\instance' to connect to named instance
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
  server: '192.168.1.113',
//  server: '10.1.2.17', //   server: 'busche-sql', // You can use 'localhost\\instance' to connect to named instance
  database: 'cribmaster',
  port: 1433,
  //    debug: true,

  requestTimeout: 60000,
  options: {
      encrypt: false // Use this if you're on Windows Azure
      //,instanceName: 'SQLEXPRESS'
  }

}

var prod=false;
var errors=false;

let POReqTransAPI = {
  noPOCatList(dispatch){
    var disp = dispatch;
    var cribConnection = new sql.Connection(crib,function(err){
      // error checks
      needPOCat(cribConnection,disp);
    });
    cribConnection.on('error', function(err) {
      console.log(`Connection1 err:  ${err}` );
      // ... error handler
    });
  },
  fetchPOCategories(dispatch){
    var disp = dispatch;
    var cribConnection = new sql.Connection(crib,function(err){
      // error checks
      POCategories(cribConnection,disp);
    });
    cribConnection.on('error', function(err) {
      console.log(`Connection1 err:  ${err}` );
      // ... error handler
    });
  }
}

function  needPOCat(cribConnection,disp) {
    var dispatch = disp;
    let qryCrib;
    if (prod===true) {
      qryCrib = `
        SELECT PONumber,Item,UDF_POCATEGORY, 0 as dirty
        FROM PODETAIL
        WHERE PONUMBER in
        (
          SELECT ponumber FROM [PO]  WHERE [PO].POSTATUSNO = 3 and [PO].SITEID <> '90'
        )
        and UDF_POCATEGORY is null
      `;
    }else{
      qryCrib = `
        SELECT PONumber,Item,UDF_POCATEGORY, 0 as dirty
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
        dispatch({ type: SET_NO_CAT_LIST, noCatList:cribRs });
      }else {
  //      poVendorChk(cribConnection);
      }
    });
  }

function  POCategories(cribConnection,disp) {
  var dispatch = disp;
    let qryCrib = `
      select UDF_POCATEGORY,UDF_POCATEGORYDescription descr from UDT_POCATEGORY
    `;

    let cribReq = new sql.Request(cribConnection);

    cribReq.query(qryCrib, function(err,cribRs) {
      // error checks
      if(cribRs.length!==0){
        dispatch({ type:SET_PO_CATEGORIES, poCategories:cribRs });
      }else {
      }
    });
  }



function  poCatChk(disp,cribConnection) {
//    var that = this;
    var dispatch = disp;
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
  //      document.getElementById('msgToUsr').innerHTML += `<div class="failed">Failed Cribmaster PO category check.</div>`;
  //      dialog.showMessageBox({ message:
  //        `Failed PO category check:\nNo Cribmaster PO category is selected on the following PO(s):\n${cribRsErr}\n\nFix issue then click PO Update.`,
  //        buttons: ["OK"] });
//        that.props.setCheck1('failure');
        dispatch({ type: SET_NO_CAT_LIST, noCatList:cribRs });
  //       let page = 1
  //       that.setState({
  //           results: cribRs,
  //           currentPage: page-1,
  //           maxPages: 1
  // //          maxPages: Math.round(data.count/10)
  //         })
          //        that.props.setCheck1('failure');
      }else {
  //      document.getElementById('msgToUsr').innerHTML = `<div class="passed">Passed Cribmaster PO category check.</div>`;
  //      poVendorChk(cribConnection);
      }
    });
  }

function POReqTrans(dispatch) {
//  var that = this;
  var disp = dispatch;
//  document.getElementById('msgToUsr').innerHTML = '';
  var cribConnection = new sql.Connection(crib,function(err){
    // error checks
    poCatChk(disp,cribConnection);
  });
  cribConnection.on('error', function(err) {
    console.log(`Connection1 err:  ${err}` );
    // ... error handler
  });
} // poUpdate



var msSqlModule = function () {

  var rootURL = 'http://swapi.co/api/';


  function request(url, cb) {
    function listener(e) {
      if(oReq.readyState != 4 && e.type !== 'load') return;
      if(oReq.status && oReq.status != 200) {
        //this will be the error handler
      } else {
        cb(JSON.parse(oReq.responseText));
      }
    }

    var oReq;
    // Use XDomainRequest if it's available (to support IE<10)
    if (window.XDomainRequest) {
      oReq = new XDomainRequest();
      oReq.open('get', url, true);

      // Update the timeout to 30 seconds for XDomainRequests. 
      oReq.timeout = 30000;
    } else {
      oReq = new XMLHttpRequest();
      oReq.open('get', url, true);
      oReq.setRequestHeader('User-Agent', 'swapi-javascript');
      oReq.setRequestHeader('Accept', 'application/json');
    }
    oReq.onload = listener;

    // Wrap in a 0 millisecond timeout.
    // XDomainRequests appear to randomly fail unless kicked into a new scope.
    setTimeout(function(){
      oReq.send();
    }, 0);
  }

  function getResources(cb) {
    request(rootURL, cb);
  }

  //generic for ALL calls, todo, why optimize now!
  function getResource(u, cb) {

  }

  function singularRequestGenerator(path) {
    return function(id, cb) {
      request(rootURL + path + '/'+id+'/', cb);
    };
  }

  function pluralRequestGenerator(path) {
    return function() {
      if(arguments.length === 1) {
        request(rootURL + path + '/', arguments[0]);
      } else {
        request(rootURL + path + '/?page=' + arguments[0], arguments[1]);
      }
    };
  }

  return {
    getResources:  getResources,
    getPerson:     singularRequestGenerator('people'),
    getPeople:     pluralRequestGenerator('people'),
    getFilm:       singularRequestGenerator('films'),
    getFilms:      pluralRequestGenerator('films'),
    getPlanet:     singularRequestGenerator('planets'),
    getPlanets:    pluralRequestGenerator('planets'),
    getSpecies:    singularRequestGenerator('species'),
    getAllSpecies: pluralRequestGenerator('species'),
    getStarship:   singularRequestGenerator('starships'),
    getStarships:  pluralRequestGenerator('starships'),
    getVehicle:    singularRequestGenerator('vehicles'),
    getVehicles:   pluralRequestGenerator('vehicles')
  };

}();

export default POReqTrans;