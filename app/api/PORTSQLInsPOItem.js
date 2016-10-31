
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"


var sql1Done=false;
var sql1Cnt=0;
var sql1Failed=false;
var contPORT=false;
const ATTEMPTS=1;



export async function sql1(disp,getSt){
//  var that = this;
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 
  if ('development'==process.env.NODE_ENV) {
    console.dir(state);
  }


  var cnt=0;
  init();
  execSQL1(dispatch,getState);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLInsPOItem.sql1() Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLInsPOItem.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLInsPOItem.sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLInsPOItem.sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLInsPOItem.sql1(): Suceeded`)
    }
  }

}

function init(){
  sql1Done=false;
  sql1Cnt=0;
  sql1Failed=false;
  contPORT=false;

}

export function isDone(){
  if(
    (true==sql1Done)
    )
  {
    return true;
  } else{
    return false;
  }
}

export function didFail(){
  if(
    (true==sql1Failed)
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

function execSQL1(disp,getSt){
  var dispatch = disp;
  var getState = getSt;
  var state = getState(); 

  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQLInsPOItem.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLInsPOItem.execSQL1() Connection Sucess`);
      }

      var allInsSucceded=true;
      state.POReqTrans.poItem.forEach(function(po,i,arr){
        if ('development'==process.env.NODE_ENV) {
//          console.log(`po.forddate=>${po.forddate}`);
        }

        let proc;

        if (MISC.PROD===true) {
          proc = `bpPOItemInsert`;
        }else{
          proc = `bpDevPOItemInsert`;
        }


        var request = new sql.Request(connection); 
        request.input('fpono', sql.Char(6), po.fpono);
        request.input('fpartno', sql.Char(25), po.fpartno);
        request.input('frev', sql.Char(3), po.frev);
        request.input('fmeasure', sql.Char(3), po.fmeasure);
        request.input('fitemno', sql.Char(3), po.fitemno);
        request.input('frelsno', sql.Char(3), po.frelsno);
        request.input('fcategory', sql.Char(8), po.fcategory);

        request.input('fjoopno', sql.Int, po.fjoopno);
        request.input('flstcost', sql.Numeric(17,5), po.flstcost);
        request.input('fstdcost', sql.Numeric(17,5), po.fstdcost);
        request.input('fleadtime', sql.Numeric(5,1), po.fleadtime);
        request.input('forgpdate', sql.DateTime, po.forgpdate);
        request.input('flstpdate', sql.DateTime, po.flstpdate);

        request.input('fmultirls', sql.Char(1), po.fmultirls);
        request.input('fnextrels', sql.Int, po.fnextrels);
        request.input('fnqtydm', sql.Numeric(15,5), po.fnqtydm);
        request.input('freqdate', sql.DateTime, po.freqdate);
        request.input('fretqty', sql.Numeric(15,5), po.fretqty);

        request.input('fordqty', sql.Numeric(15,5), po.fordqty);
        request.input('fqtyutol', sql.Numeric(6,2), po.fqtyutol);
        request.input('fqtyltol', sql.Numeric(6,2), po.fqtyltol);
        request.input('fbkordqty', sql.Numeric(15,5), po.fbkordqty);
        request.input('flstsdate', sql.DateTime, po.flstsdate);
        request.input('frcpdate', sql.DateTime, po.frcpdate);
        request.input('frcpqty', sql.Numeric(15,5), po.frcpqty);
        request.input('fshpqty', sql.Numeric(15,5), po.fshpqty);

        request.input('finvqty', sql.Numeric(15,5), po.finvqty);
        request.input('fdiscount', sql.Numeric(5,1), po.fdiscount);
        request.input('fstandard', sql.Bit, po.fstandard);

        request.input('ftax', sql.Char(1), po.ftax);
        request.input('fsalestax', sql.Numeric(7,3), po.fsalestax);
        request.input('flcost', sql.Numeric(17,5), po.flcost);

        request.input('fucost', sql.Numeric(17,5), po.fucost);
        request.input('fprintmemo', sql.Char(1), po.fprintmemo);
        request.input('fvlstcost', sql.Numeric(17,5), po.fvlstcost);
        request.input('fvleadtime', sql.Numeric(5,1), po.fvleadtime);
        request.input('fvmeasure', sql.Char(5), po.fvmeasure);

        request.input('fvptdes', sql.VarChar(35), po.fvptdes);
        request.input('fvordqty', sql.Numeric(15,5), po.fvordqty);
        request.input('fvconvfact', sql.Numeric(13,9), po.fvconvfact);
        request.input('fvucost', sql.Numeric(17,5), po.fvucost);
        request.input('fqtyshipr', sql.Numeric(15,5), po.fqtyshipr);

        request.input('fdateship', sql.DateTime, po.fdateship);
        request.input('fnorgucost', sql.Numeric(17,5), po.fnorgucost);
        request.input('fnorgeurcost', sql.Numeric(17,5), po.fnorgeurcost);
        request.input('fnorgtxncost', sql.Numeric(17,5), po.fnorgtxncost);
        request.input('futxncost', sql.Numeric(17,5), po.futxncost);
        request.input('fvueurocost', sql.Numeric(17,5), po.fvueurocost);
        request.input('fvutxncost', sql.Numeric(17,5), po.fvutxncost);
        request.input('fljrdif', sql.Bit, po.fljrdif);

        request.input('fucostonly', sql.Numeric(17,5), po.fucostonly);
        request.input('futxncston', sql.Numeric(17,5), po.futxncston);
        request.input('fueurcston', sql.Numeric(17,5), po.fueurcston);
        request.input('fcomments', sql.Text, po.fcomments);
        request.input('fdescript', sql.Text, po.fdescript);
        request.input('Fac', sql.Char(20), po.Fac);
        request.input('fndbrmod', sql.Int, po.fndbrmod);
        request.input('SchedDate', sql.DateTime, po.SchedDate);

        request.input('fsokey', sql.Char(6), po.fsokey);
        request.input('fsoitm', sql.Char(3), po.fsoitm);
        request.input('fsorls', sql.Char(3), po.fsorls);
        request.input('fjokey', sql.Char(10), po.fjokey);
        request.input('fjoitm', sql.Char(6), po.fjoitm);
        request.input('frework', sql.Char(1), po.frework);
        request.input('finspect', sql.Char(1), po.finspect);
        request.input('fvpartno', sql.Char(25), po.fvpartno);

        request.input('fparentpo', sql.Char(6), po.fparentpo);
        request.input('frmano', sql.Char(25), po.frmano);
        request.input('fdebitmemo', sql.Char(1), po.fdebitmemo);
        request.input('finspcode', sql.Char(4), po.finspcode);
        request.input('freceiver', sql.Char(6), po.freceiver);
        request.input('fcorgcateg', sql.Char(19), po.fcorgcateg);
        request.input('fparentitm', sql.Char(3), po.fparentitm);
        request.input('fparentrls', sql.Char(3), po.fparentrls);

        request.input('frecvitm', sql.Char(3), po.frecvitm);
        request.input('fueurocost', sql.Numeric(17,5), po.fueurocost);
        request.input('FCBIN', sql.Char(14), po.FCBIN);
        request.input('FCLOC', sql.Char(14), po.FCLOC);
        request.input('fcudrev', sql.Char(3), po.fcudrev);
        request.input('blanketPO', sql.Bit, po.blanketPO);
        request.input('PlaceDate', sql.DateTime, po.PlaceDate);
        request.input('DockTime', sql.Int, po.DockTime);

        request.input('PurchBuf', sql.Int, po.PurchBuf);
        request.input('Final', sql.Bit, po.Final);
        request.input('AvailDate', sql.DateTime, po.AvailDate);

/*

@PurchBuf int,
@Final bit,
@AvailDate datetime

fpono,cribpo,fcompany,fcshipto, forddate,fstatus,fvendno,fbuyer,
fchangeby,fshipvia, fcngdate, fcreate, ffob, fmethod, foldstatus, fordrevdt, 
fordtot,fpayterm,fpaytype,fporev,fprint,freqdate,freqsdt,freqsno, frevtot, 
fsalestax, ftax, fcsnaddrke, fnnextitem, fautoclose,fnusrqty1,fnusrcur1, fdusrdate1,fcfactor,
fdcurdate, fdeurodate, feurofctr, fctype, fmsnstreet, fpoclosing,fndbrmod, 
fcsncity, fcsnstate, fcsnzip, fcsncountr, fcsnphone,fcsnfax,fcshcompan,fcshcity,
fcshstate,fcshzip,fcshcountr,fcshphone,fcshfax,fmshstreet,
flpdate,fconfirm,fcontact,fcfname,fcshkey,fcshaddrke,fcusrchr1,fcusrchr2,fcusrchr3,
fccurid,fmpaytype,fmusrmemo1,freasoncng
*/
        request.execute(proc, function(err, recordsets, returnValue) {
          // ... error checks
          if(null==err){
            // ... error checks
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLInsPOItem.execSQL1() Sucess`);
            }

          }else {
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLInsPOItem.execSQL1():  ${err.message}` );
            }
            dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
            dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
            sql1Failed=true;
            allInsSucceded=false;
          }
        });
      });

      if(allInsSucceded){
        contPORT=true;
      }
      sql1Done=true;
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLInsPOItem.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLInsPOItem.Connection: ${err.message}` );
        }

        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        sql1Failed=true;
      }
    }
  });
  
  connection.on('error', function(err) {
    if(++sql1Cnt<ATTEMPTS) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLInsPOItem.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLInsPOItem.connection.on(error): ${err.message}` );
      }

      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}


