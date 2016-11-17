
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
    console.log(`SQLRCItemInsert->top.`);
  }


  var cnt=0;
  init(dispatch);
  execSQL1(dispatch,getState);

}

function init(dispatch){
  sql1Cnt=0;
  dispatch({ type:GRACTION.RCITEM_INSERT_FAILED, failed:false });
  dispatch({ type:GRACTION.RCITEM_INSERT_DONE, done:false });
}


function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 

  if ('development'==process.env.NODE_ENV) {
    console.log(`SQLRCItemInsert.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`SQLRCItemInsert.execSQL1() Connection Sucess`);
      }
      var allInsSucceded=true;
      state.GenReceivers.rcitem.forEach(function(rcitem,i,arr){
        if ('development'==process.env.NODE_ENV) {
         // console.log(`po.forddate=>${po.forddate}`);
        }

        let sproc;

        if (MISC.PROD===true) {
          sproc = `bpGRRCItemInsert`;
        }else{
          sproc = `bpGRRCItemInsertDev`;
        }


        var request = new sql.Request(connection); 
        request.input('fitemno', sql.Char(3), rcitem.fitemno);
        request.input('fpartno', sql.Char(25), rcitem.fpartno);
        request.input('fpartrev', sql.Char(3), rcitem.fpartrev);
        request.input('finvcost', sql.Numeric(17,5), rcitem.finvcost);        
        request.input('fcategory', sql.Char(8), rcitem.fcategory);
        request.input('fcstatus', sql.Char(1), rcitem.fcstatus);
        request.input('fiqtyinv', sql.Numeric(15,5), rcitem.fiqtyinv);        
        request.input('fjokey', sql.Char(10), rcitem.fjokey);
        request.input('fsokey', sql.Char(6), rcitem.fsokey);
        request.input('fsoitem', sql.Char(3), rcitem.fsoitem);
        request.input('fsorelsno', sql.Char(3), rcitem.fsorelsno);
        request.input('fvqtyrecv', sql.Numeric(15,5), rcitem.fvqtyrecv);        
        request.input('fqtyrecv', sql.Numeric(15,5), rcitem.fqtyrecv);        
        request.input('freceiver', sql.Char(6), rcitem.freceiver);
        request.input('frelsno', sql.Char(3), rcitem.frelsno);
        request.input('fvendno', sql.Char(6), rcitem.fvendno);
        request.input('fbinno', sql.Char(14), rcitem.fbinno);
        request.input('fexpdate', sql.DateTime, rcitem.fexpdate);
        request.input('finspect', sql.Char(1), rcitem.finspect);
        request.input('finvqty', sql.Numeric(15,5), rcitem.finvqty);        
        request.input('flocation', sql.Char(14), rcitem.flocation);
        request.input('flot', sql.Char(20), rcitem.flot);
        request.input('fmeasure', sql.Char(3), rcitem.fmeasure);
        request.input('fpoitemno', sql.Char(3), rcitem.fpoitemno);
        request.input('fretcredit', sql.Char(1), rcitem.fretcredit);
        request.input('ftype', sql.Char(1), rcitem.ftype);
        request.input('fumvori', sql.Char(1), rcitem.fumvori);
        request.input('fqtyinsp', sql.Numeric(15,5), rcitem.fqtyinsp);        
        request.input('fauthorize', sql.Char(20), rcitem.fauthorize);
        request.input('fucost', sql.Numeric(17,5), rcitem.fucost);        
        request.input('fllotreqd', sql.Bit, rcitem.fllotreqd);
        request.input('flexpreqd', sql.Bit, rcitem.flexpreqd);
        request.input('fctojoblot', sql.Char(20), rcitem.fctojoblot);
        request.input('fdiscount', sql.Numeric(5,1), rcitem.fdiscount);        
        request.input('fueurocost', sql.Numeric(17,5), rcitem.fueurocost);        
        request.input('futxncost', sql.Numeric(17,5), rcitem.futxncost);        
        request.input('fucostonly', sql.Numeric(17,5), rcitem.fucostonly);        
        request.input('futxncston', sql.Numeric(17,5), rcitem.futxncston);        
        request.input('fueurcston', sql.Numeric(17,5), rcitem.fueurcston);        
        request.input('flconvovrd', sql.Bit, rcitem.flconvovrd);
        request.input('fcomments', sql.Text, rcitem.fcomments);
        request.input('fdescript', sql.Text, rcitem.fdescript);
        request.input('fac', sql.Char(20), rcitem.fac);
        request.input('sfac', sql.Char(20), rcitem.sfac);
        request.input('FCORIGUM', sql.Char(3), rcitem.FCORIGUM);
        request.input('fcudrev', sql.Char(3), rcitem.fcudrev);
        request.input('FNORIGQTY', sql.Numeric(18,5), rcitem.FNORIGQTY);        
        request.input('Iso', sql.Char(10), rcitem.Iso);
        request.input('Ship_Link', sql.Int, rcitem.Ship_Link);
        request.input('ShsrceLink', sql.Int, rcitem.ShsrceLink);
        request.input('fCINSTRUCT', sql.Char(2), rcitem.fCINSTRUCT);
/*
@fCINSTRUCT as char(2)
*/
        request.execute(sproc, function(err, recordsets, returnValue) {
          // ... error checks
          if(null==err){
            // ... error checks
            if ('development'==process.env.NODE_ENV) {
              console.log(`SQLRCItemInsert.execSQL1() Sucess`);
            }
          }else {
            if(++sql1Cnt<ATTEMPTS) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`SQLRCItemInsert.execSQL1().query:  ${err.message}` );
                console.log(`sql1Cnt = ${sql1Cnt}`);
              }
            }else{
              if ('development'==process.env.NODE_ENV) {
                console.log(`SQLRCItemInsert.execSQL1():  ${err.message}` );
              }
              dispatch({ type:GRACTION.SET_REASON, reason:err.message });
              dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
              dispatch({ type:GRACTION.RCITEM_INSERT_FAILED, failed:true });
              allInsSucceded=false;
            }
          }
        });
      });
      if(allInsSucceded){
        dispatch({ type:GRACTION.RCITEM_INSERT_FAILED, failed:false });
      }else{
        dispatch({ type:GRACTION.RCITEM_INSERT_FAILED, failed:true });
      }

      dispatch({ type:GRACTION.RCITEM_INSERT_DONE, done:true });

    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLRCItemInsert.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`SQLRCItemInsert.Connection: ${err.message}` );
        }

        dispatch({ type:GRACTION.SET_REASON, reason:err.message });
        dispatch({ type:GRACTION.SET_STATE, state:GRSTATE.FAILURE });
        dispatch({ type:GRACTION.RCITEM_INSERT_FAILED, failed:true });
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


