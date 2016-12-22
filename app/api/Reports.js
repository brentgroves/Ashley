
var sql = require('mssql');

import { remote,ipcRenderer } from 'electron';



import * as CONNECT from "SQLConst.js"
import * as ACTION from "../actions/RptConst.js"
import * as STATE from "../actions/RptState.js"
import * as MISC from "Misc.js"
import * as PROGRESSBUTTON from "../actions/ProgressButtonConst.js"

//import * as hashLeftOuterJoin from "lodash-joins/lib/hash/hashLeftOuterJoin.js"
var _ = require('lodash');
var joins = require('lodash-joins');
var sorty    = require('sorty')
var fs = require('fs');
var client = require("jsreport-client")('http://10.1.1.217:5488', 'admin', 'password')





export async function POStatusReport(disp,getSt) {
  var dispatch = disp;
  var getState = getSt;
  var continueProcess=true;


  //remote.dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
  dispatch({ type:ACTION.SET_GO_BUTTON, goButton:PROGRESSBUTTON.LOADING });
  dispatch({ type:ACTION.SET_STATE, state:STATE.STARTED });

  var dirName=remote.app.getPath('temp');

  if ('development'==process.env.NODE_ENV) {
    console.log(`remote = } `);
    console.dir(remote);
    console.log(` dirName: ${ dirName}`);
  }

  if(continueProcess){
    client.render({

  //      template: { shortid:"HJEa3YSNl"}
        template: { shortid:"SkVLXedVe"} // sample report
//http://10.1.1.217:5488/templates/B1WBsctr4e
  //      template: { content: "hello {{:someText}}", recipe: "html",
  //                  engine: "jsrender" },
  //      data: { someText: "world!!" }
    }, function(err, response) {
        var dirName1 = dirName;

        if ('development'==process.env.NODE_ENV) {
          console.log(`dirName: ${dirName}`);
          console.log(`dirName1: ${dirName1}`);
          console.log(`err =  `);
          console.dir(err);
        }
      //dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      //dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      //dispatch({ type:GRACTION.LOG_ENTRY_LAST_FAILED, failed:true });

        response.body(function(body) {
          var dirName2 = dirName1;
          let fileName =  dirName2 + '/myfile.pdf';
          if ('development'==process.env.NODE_ENV) {
            console.log(`dirName: ${dirName}`);
            console.log(`dirName1: ${dirName1}`);
            console.log(`dirName2: ${dirName2}`);
            console.log(`fileName: ${fileName}`);
          }

          fs.writeFileSync(fileName,body);
//          fs.writeFileSync('/home/brent/myfile.pdf',body);
          dispatch({ type:ACTION.SET_POSTATUS_REPORT_DONE, done:true });
          if ('development'==process.env.NODE_ENV) {
            console.log(`Done creating file myfile.pdf `);
            console.log(`fileName: ${fileName}`);
          }
          ipcRenderer.send('asynchronous-message', fileName)
          //dispatch({ type:GRACTION.SET_POSTATUS_REPORT_PDF, pdf:body });
        });
    });

    var cnt=0;
    var maxCnt=40;
    while(!getState().Reports.poStatusReport.done){
      if(++cnt>maxCnt){
        continueProcess=false;
        break;
      }else{
        await MISC.sleep(2000);
      }
    }

    if(getState().Reports.poStatusReport.failed || 
      !getState().Reports.poStatusReport.done){
      if ('development'==process.env.NODE_ENV) {
        console.log(`POStatusReport not successful.`);
      }
      dispatch({ type:ACTION.SET_REASON, reason:`If the PO Status report did not complete please ask IT to refresh the Report Server. `});
      dispatch({ type:ACTION.SET_STATE, state:STATE.FAILURE });
      dispatch({ type:ACTION.SET_STATUS, status:'Can not connect to Report Server...' });
      continueProcess=false;
    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`POStatusReport Success.`);
      }
      dispatch({ type:ACTION.SET_STATE, state:STATE.SUCCESS});
    }
  }

}
