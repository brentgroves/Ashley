
var sql = require('mssql');
import * as GRACTION from "../../actions/GRConst.js"
import * as GRSTATE from "../../actions/GRState.js"
import * as CONNECT from "../SQLConst.js"
import * as MISC from "../Misc.js"


var sql1Cnt=0;
const ATTEMPTS=1;



export async function sql1(disp,getSt){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLRCMastInsert->top.`);
  }


  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState);

}

function init(dispatch){
  sql1Cnt=0;
  dispatch({ type:GRACTION.RCMAST_INSERT_FAILED, failed:false });
  dispatch({ type:GRACTION.RCMAST_INSERT_DONE, done:false });
}


function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 

  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLRCMastInsert.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCMastInsert.execSQL1() Connection Sucess`);
      }
      var allInsSucceded=true;
      state.GenReceivers.rcmast.forEach(function(rcmast,i,arr){
        if ('development'==process.env.NODE_ENV) {
         // console.log(`po.forddate=>${po.forddate}`);
        }

        let sproc;

        if (MISC.PROD===true) {
          sproc = `bpGRRCMastInsert`;
        }else{
          sproc = `bpGRRCMastInsertDev`;
        }


        var request = new sql.Request(connection); 
        request.input('fclandcost', sql.Char(1), rcmast.fclandcost);
        request.input('frmano', sql.Char(25), rcmast.frmano);
        request.input('fporev', sql.Char(2), rcmast.fporev);
        request.input('fcstatus', sql.Char(1), rcmast.fcstatus);
        request.input('fdaterecv', sql.DateTime, rcmast.fdaterecv);
        request.input('fpono', sql.Char(6), rcmast.fpono);
        request.input('freceiver', sql.Char(6), rcmast.freceiver);
        request.input('fvendno', sql.Char(6), rcmast.fvendno);
        request.input('faccptby', sql.Char(3), rcmast.faccptby);
        request.input('fbilllad', sql.Char(18), rcmast.fbilllad);
        request.input('fcompany', sql.VarChar(35), rcmast.fcompany);
        request.input('ffrtcarr', sql.Char(20), rcmast.ffrtcarr);
        request.input('fpacklist', sql.Char(15), rcmast.fpacklist);
        request.input('fretship', sql.Char(1), rcmast.fretship);
        request.input('fshipwgt', sql.Numeric(11,2), rcmast.fshipwgt);
        request.input('ftype', sql.Char(1), rcmast.ftype);
        request.input('start', sql.DateTime, rcmast.start);
        request.input('fprinted', sql.Bit, rcmast.fprinted);
        request.input('flothrupd', sql.Bit, rcmast.flothrupd);
        request.input('fccurid', sql.Char(3), rcmast.fccurid);
        request.input('fcfactor', sql.Numeric(17,5), rcmast.fcfactor);        
        request.input('fdcurdate', sql.DateTime, rcmast.fdcurdate);
        request.input('fdeurodate', sql.DateTime, rcmast.fdeurodate);
        request.input('feurofctr', sql.Numeric(17,5), rcmast.feurofctr);        
        request.input('flpremcv', sql.Bit, rcmast.flpremcv);
        request.input('docstatus', sql.Char(10), rcmast.docstatus);
        request.input('frmacreator', sql.VarChar(25), rcmast.frmacreator);

/*
@frmacreator as varchar(25)
*/
        request.execute(sproc, function(err, recordsets, returnValue) {
          // ... error checks
          if(null==err){
            // ... error checks
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLRCMastInsert.execSQL1() Sucess`);
            }
          }else {
            if(++sql1Cnt<ATTEMPTS) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`SQLRCMastInsert.execSQL1().query:  ${err.message}` );
                console.log(`sql1Cnt = ${sql1Cnt}`);
              }
            }else{
              if ('development'==process.env.NODE_ENV) {
                console.log(`SQLRCMastInsert.execSQL1():  ${err.message}` );
              }
              dispatch({ type:GRACTION.SET_REASON, reason:err.message });
              dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
              dispatch({ type:GRACTION.RCMAST_INSERT_FAILED, failed:true });
              allInsSucceded=false;
            }
          }
        });
      });
      if(allInsSucceded){
        dispatch({ type:GRACTION.RCMAST_INSERT_FAILED, failed:false });
      }
      dispatch({ type:GRACTION.RCMAST_INSERT_DONE, done:true });

    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLRCMastInsert.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLRCMastInsert.Connection: ${err.message}` );
        }

        dispatch({ type:GRACTION.SET_REASON, reason:err.message });
        dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
        dispatch({ type:GRACTION.RCMAST_INSERT_FAILED, failed:true });
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCMastInsert.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCMastInsert.connection.on(error): ${err.message}` );
      }

      dispatch({ type:GRACTION.SET_REASON, reason:err.message });
      dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
      dispatch({ type:GRACTION.RCMAST_INSERT_FAILED, failed:true });
    }
  });
}


