
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
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLInsPOMast.sql1() Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLInsPOMast.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLInsPOMast.sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLInsPOMast.sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLInsPOMast.sql1(): Suceeded`)
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
    console.log(`PORTSQLInsPOMast.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.m2mDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLInsPOMast.execSQL1() Connection Sucess`);
      }
      var allInsSucceded=true;
      state.POReqTrans.poMast.forEach(function(po,i,arr){
        if ('development'==process.env.NODE_ENV) {
          console.log(`po.forddate=>${po.forddate}`);
        }

        let proc;

        if (MISC.PROD===true) {
          proc = `bpPOMastInsert`;
        }else{
          proc = `bpDevPOMastInsert`;
        }


        var request = new sql.Request(connection); 
        request.input('fpono', sql.Char(6), po.fpono);
        request.input('fcompany', sql.VarChar(35), po.fcompany);
        request.input('fcshipto', sql.Char(8), po.fcshipto);
        request.input('forddate', sql.DateTime, po.forddate);
        request.input('fstatus', sql.Char(20), po.fstatus);
        request.input('fvendno', sql.Char(6), po.fvendno);
        request.input('fbuyer', sql.Char(3), po.fbuyer);
        request.input('fchangeby', sql.Char(25), po.fchangeby);
        request.input('fshipvia', sql.Char(20), po.fshipvia);
        request.input('fcngdate', sql.DateTime, po.fcngdate);
        request.input('fcreate', sql.DateTime, po.fcreate);
        request.input('ffob', sql.Char(20), po.ffob);
        request.input('fmethod', sql.Char(1), po.fmethod);
        request.input('foldstatus', sql.Char(20), po.foldstatus);
        request.input('fordrevdt', sql.DateTime, po.fordrevdt);
        request.input('fordtot', sql.Numeric(15, 5), po.fordtot);
        request.input('fpayterm', sql.Char(4), po.fpayterm);
        request.input('fpaytype', sql.Char(1), po.fpaytype);
        request.input('fporev', sql.Char(2), po.fporev);
        request.input('fprint', sql.Char(1), po.fprint);
        request.input('freqdate', sql.DateTime, po.freqdate);
        request.input('freqsdt', sql.DateTime, po.freqsdt);
        request.input('freqsno', sql.Char(6), po.freqsno);
        request.input('frevtot', sql.Numeric(15,5), po.frevtot);  
        request.input('fsalestax', sql.Numeric(7,3), po.fsalestax);
        request.input('ftax', sql.Char(1), po.ftax);
        request.input('fcsnaddrke', sql.Char(4), po.fcsnaddrke);
        request.input('fnnextitem', sql.Int, po.fnnextitem);
        request.input('fautoclose', sql.Char(1), po.fautoclose);
        request.input('fnusrqty1', sql.Numeric(17,5), po.fnusrqty1);
        request.input('fnusrcur1', sql.Money, po.fnusrcur1);
        request.input('fdusrdate1', sql.DateTime, po.fdusrdate1);
        request.input('fcfactor', sql.Numeric(17,5), po.fcfactor);        
        request.input('fdcurdate', sql.DateTime, po.fdcurdate);
        request.input('fdeurodate', sql.DateTime, po.fdeurodate);
        request.input('feurofctr', sql.Numeric(17,5), po.feurofctr);
        request.input('fctype', sql.Char(1), po.fctype);
        request.input('fmsnstreet', sql.Text, po.fmsnstreet);
        request.input('fpoclosing', sql.Text, po.fpoclosing);
        request.input('fndbrmod', sql.Int, po.fndbrmod);        
        request.input('fcsncity', sql.Char(20), po.fcsncity);
        request.input('fcsnstate', sql.Char(20), po.fcsnstate);
        request.input('fcsnzip', sql.Char(10), po.fcsnzip);
        request.input('fcsncountr', sql.Char(25), po.fcsncountr);
        request.input('fcsnphone', sql.Char(20), po.fcsnphone);
        request.input('fcsnfax', sql.Char(20), po.fcsnfax);
        request.input('fcshcompan', sql.Char(35), po.fcshcompan);        
        request.input('fcshcity', sql.Char(20), po.fcshcity);
        request.input('fcshstate', sql.Char(20), po.fcshstate);
        request.input('fcshzip', sql.Char(10), po.fcshzip);
        request.input('fcshcountr', sql.Char(25), po.fcshcountr);
        request.input('fcshphone', sql.Char(20), po.fcshphone);
        request.input('fcshfax', sql.Char(20), po.fcshfax);
        request.input('fmshstreet', sql.Text, po.fmshstreet);
        request.input('flpdate', sql.DateTime, po.flpdate);
        request.input('fconfirm', sql.Char(19), po.fconfirm);
        request.input('fcontact', sql.Char(20), po.fcontact);
        request.input('fcfname', sql.Char(15), po.fcfname);
        request.input('fcshkey', sql.Char(6), po.fcshkey);
        request.input('fcshaddrke', sql.Char(4), po.fcshaddrke);        
        request.input('fcusrchr1', sql.Char(20), po.fcusrchr1);
        request.input('fcusrchr2', sql.VarChar(40), po.fcusrchr2);
        request.input('fcusrchr3', sql.VarChar(40), po.fcusrchr3);
        request.input('fccurid', sql.Char(3), po.fccurid);
        request.input('fmpaytype', sql.Text, po.fmpaytype);
        request.input('fmusrmemo1', sql.Text, po.fmusrmemo1);
        request.input('freasoncng', sql.Text, po.freasoncng);        

/*
@flpdate datetime,
@fconfirm char(19),
@fcontact char(20),
@fcfname char(15),
@fcshkey char(6),
@fcshaddrke char(4),
@fcusrchr1 char(20),
@fcusrchr2 varchar(40),
@fcusrchr3 varchar(40),
@fccurid char(3),
@fmpaytype text,
@fmusrmemo1 text,
@freasoncng text


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
              console.log(`PORTSQLInsPOMast.execSQL1() Sucess`);
            }
          }else {
            if(++sql1Cnt<ATTEMPTS) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`PORTSQLInsPOMast.execSQL1().query:  ${err.message}` );
                console.log(`sql1Cnt = ${sql1Cnt}`);
              }
            }else{
              if ('development'==process.env.NODE_ENV) {
                console.log(`PORTSQLInsPOMast.execSQL1():  ${err.message}` );
              }
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              sql1Failed=true;
              allInsSucceded=false;
            }
          }
        });
      });
      if(allInsSucceded){
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_50_PASS });
        contPORT=true;
      }
      sql1Done=true;

    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLInsPOMast.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLInsPOMast.Connection: ${err.message}` );
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
        console.log(`PORTSQLInsPOMast.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLInsPOMast.connection.on(error): ${err.message}` );
      }

      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}


