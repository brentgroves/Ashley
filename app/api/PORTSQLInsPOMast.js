
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

/*
@fordtot as numeric(15, 5),
@fpayterm as char(4),
@fpaytype as char(1),
@fporev as char(2),
@fprint as char(1),
@freqdate as datetime,
@freqsdt as datetime,
@freqsno as char(6), 
@frevtot as numeric(15, 5) 

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
            contPORT=true;
            sql1Done=true;
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
            }
          }
        });
      });
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


