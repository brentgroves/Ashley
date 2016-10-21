
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
    console.log(`PORTSQL.sql1=> top`);
  }


  var cnt=0;
  init();
  execSQL1(dispatch,state);

  while(!isDone() && !didFail()){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`PORTSQLCurrentPO.sql1() Timed Out or Failed.` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isDone()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLCurrentPO.sql1(): Completed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLCurrentPO.sql1(): Did NOT Complete`)
    }
  }

  if(didFail()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLCurrentPO.sql1(): Failed`)
    }

  }else{
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORTSQLCurrentPO.sql1(): Suceeded`)
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



function execSQL1(disp,PORTstate){
  var dispatch = disp;
  var state=PORTstate; 
  if ('development'==process.env.NODE_ENV) {
    console.log(`PORTSQL.execSQL1() top=>${sql1Cnt}`);
  }


  var connection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQL.execSQL1() Connection Sucess`);
        console.log(`currentPO=>${state.POReqTrans.currentPO}`);
      }

      let currentPO=state.POReqTrans.currentPO;
      let nextPO;
      let qry;

      if (MISC.PROD===true) {
        qry = `
        select PONumber,Vendor,fccompany,fccity,fcstate,fczip,fccountry,fcphone,fcfax,
        PODate,UDFM2MVENDORNUMBER,fcterms
        from 
        (
            SELECT PONumber,Vendor,PODate 
            FROM [btPO]  
            WHERE POSTATUSNO = 3 and SITEID <> '90' and (BLANKETPO = '' or BLANKETPO is null)
        )po1
        inner join 
        (
            select VendorNumber,UDFM2MVENDORNUMBER from vendor 
        )vn1
        on po1.Vendor = vn1.VendorNumber
        inner join
        (
            SELECT fvendno,fcterms,fccompany,fccity,fcstate,fczip,fccountry,fcphone,fcfax FROM btapvend  
        )av1
        on vn1.UDFM2MVENDORNUMBER=av1.fvendno
          `;
      }else{
        qry = `
        select PONumber,Vendor,fccompany,fccity,fcstate,fczip,fccountry,fcphone,fcfax,
        PODate,UDFM2MVENDORNUMBER,fcterms
        from 
        (
            SELECT PONumber,Vendor,PODate 
            FROM [btPO]  
            WHERE POSTATUSNO = 3 and SITEID <> '90' and (BLANKETPO = '' or BLANKETPO is null)
        )po1
        inner join 
        (
            select VendorNumber,UDFM2MVENDORNUMBER from vendor 
        )vn1
        on po1.Vendor = vn1.VendorNumber
        inner join
        (
            SELECT fvendno,fcterms,fccompany,fccity,fcstate,fczip,fccountry,fcphone,fcfax FROM btapvend  
        )av1
        on vn1.UDFM2MVENDORNUMBER=av1.fvendno
          `;
      }

      var POMast = [];
      var request = new sql.Request(connection); 
      request.query(qry, function(err, recordset) {
        // ... error checks
        if(null==err){
          if ('development'==process.env.NODE_ENV) {
            console.log(`PORTSQL.execSQL1() Sucess`);
          }
          if(recordset.length!==0){
            if ('development'==process.env.NODE_ENV) {
              console.log("PORTSQL.execSQL1() had records.");
              console.dir(recordset[0]);
            }

            recordset.forEach(function(po,i,arr){
              nextPO=currentPO+1;
              while(6 > nextPO.length){
                nextPO = '0' + nextPO;
              }
              console.log(`nextPO=>${nextPO}`);

              var insert = `
INSERT INTO [dbo].[btpomast]
           ([fcompany]
           ,[fcshipto]
           ,[forddate]
           ,[fpono]
           ,[fstatus]
           ,[fvendno]
           ,[fbuyer]
           ,[fchangeby]
           ,[fcngdate]
           ,[fcreate]
           ,[ffob]
           ,[fmethod]
           ,[foldstatus]
           ,[fordrevdt]
           ,[fordtot]
           ,[fpayterm]
           ,[fpaytype]
           ,[fporev]
           ,[fprint]
           ,[freqdate]
           ,[freqsdt]
           ,[freqsno]
           ,[frevtot]
           ,[fsalestax]
           ,[fshipvia]
           ,[ftax]
           ,[fcsnaddrke]
           ,[fcsncity]
           ,[fcsnstate]
           ,[fcsnzip]
           ,[fcsncountr]
           ,[fcsnphone]
           ,[fcsnfax]
           ,[fcshaddrke]
           ,[fcshcompan]
           ,[fcshcity]
           ,[fcshstate]
           ,[fcshzip]
           ,[fcshcountr]
           ,[fcshphone]
           ,[fcshfax]
           ,[fnnextitem]
           ,[fautoclose]
           ,[fnusrqty1]
           ,[fnusrcur1]
           ,[fdusrdate1]
           ,[fcfactor]
           ,[fdcurdate]
           ,[fdeurodate]
           ,[feurofctr]
           ,[fctype]
           ,[fmpaytype]
           ,[fmshstreet]
           ,[fmsnstreet]
           ,[fmusrmemo1]
           ,[fpoclosing]
           ,[freasoncng]
           ,[fndbrmod]
           ,[flpdate])
     VALUES
           ('${po.fccompany}'
           ,'SELF'
           ,'${po.PODate}'
           ,'${currentPO}'
           ,'OPEN'
           ,'${po.UDFM2MVENDORNUMBER}''
           ,'CM'
           ,'CM'
           ,'${po.PODate}'
           ,'${po.PODate}'
           ,'OUR PLANT'
           ,'1'
           ,'STARTED'
           ,'1900-01-01 00:00:00.000'
           ,0
           ,'${po.fcterms}'
           ,'3'
           ,'00'
           ,'N'
           ,'1900-01-01 00:00:00.000'
           ,'${po.PODate}'
           ,''
           ,0
           ,0
           ,'UPS-OURS'
           ,'N'
           ,'0001'
           ,'${po.fccity}'
           ,'${po.fcstate}'
           ,'${po.fczip}'
           ,'${po.fccountry}'
           ,'${po.fcphone}'
           ,'${po.fcfax}'
           ,'BUSCHE INDIANA'
           ,'ALBION'
           ,'IN'
           ,'46701'
           ,'USA'
           ,'2606367030'
           ,'2603637031'
           ,1
           ,'Y'
           ,0
           ,0
           ,'1900-01-01 00:00:00.000'
           ,0
           ,'1900-01-01 00:00:00.000'
           ,'1900-01-01 00:00:00.000'
           ,0
           ,'O'
           ,'1563 E. State Road 8'
           ,'${po.fmstreet}'
           ,<fmusrmemo1, text,>
           ,<fpoclosing, text,>
           ,<freasoncng, text,>
           ,<fndbrmod, int,>
           ,<flpdate, datetime,>)
`;
            console.log(`insert => ${insert}`);

            });
            // DEBUG  
            contPORT=true;
            sql1Done=true;
            return;

          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQL.execSQL1(): NO PO requests to process.` );
            }
            contPORT=false;
            sql1Done=true;
          }
          dispatch({ type:PORTACTION.SET_CURRENT_PO, currentPO:recordset[0].fcnumber });
          contPORT=true;
          sql1Done=true;
        }else {
          if(++sql1Cnt<ATTEMPTS) {
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLCurrentPO.execSQL1().query:  ${err.message}` );
              console.log(`sql1Cnt = ${sql1Cnt}`);
            }
          }else{
            if ('development'==process.env.NODE_ENV) {
              console.log(`PORTSQLCurrentPO.execSQL1() err:  ${err.message}` );
            }
            dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
            dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
            sql1Failed=true;
          }
        }
      });
    }else{
      if(++sql1Cnt<ATTEMPTS) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLCurrentPO.Connection: ${err.message}` );
          console.log(`sql1Cnt = ${sql1Cnt}`);
        }
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`PORTSQLCurrentPO.Connection: ${err.message}` );
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
        console.log(`PORTSQLCurrentPO.connection.on(error): ${err.message}` );
        console.log(`sql1Cnt = ${sql1Cnt}`);
      }

    }else{
      if ('development'==process.env.NODE_ENV) {
        console.log(`PORTSQLCurrentPO.connection.on(error): ${err.message}` );
      }
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      sql1Failed=true;
    }
  });
}


