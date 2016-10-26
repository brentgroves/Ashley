
var sql = require('mssql');
import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import * as PORTCHK from "../actions/PORTChkConst.js"
import * as CONNECT from "./PORTSQLConst.js"
import * as MISC from "./Misc.js"

var prod=false;

var portCheck1Done=false;
var portCheck1Cnt=0;
var portCheck1Failed=false;
var contChecks=false;

export async function portCheck1(disp){
  var dispatch=disp;
  var cnt=0;
  portCheck1Init();
  portChk1(dispatch);

  while(!isPortCheck1Done() && !portCheck1Failed){
    if(++cnt>15){
      dispatch({ type:PORTACTION.SET_REASON, reason:`portCheck1(disp) Cannot Connection` });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      break;
    }else{
      await MISC.sleep(2000);
    }
  }

  if(isPortCheck1Done()){
    if ('development'==process.env.NODE_ENV) {
      console.log(`portCheck1() Done`)
    }

  }

}

function portCheck1Init(){
  portCheck1Done=false;
  portCheck1Cnt=0;
  portCheck1Failed=false;
  contChecks=false;
}

export function isPortCheck1Done(){
  if(
    (true==portCheck1Done)
    )
  {
    return true;
  } else{
    return false;
  }
}

export function didCheckFail(){
  if(
    (true==portCheck1Failed)
    )
  {
    return true;
  } else{
    return false;
  }
}

export function continueChecks(){
  if(true==contChecks)
  {
    return true;
  } else{
    return false;
  }
}

/********************CHECK IF ALL PO CATEGORIES HAVE BEEN SELECTED FOR EACH PO ITEM & THE RECORDS ARE NOT LOCKED****************/

function portChk1(disp){
  var dispatch=disp;
  if ('development'==process.env.NODE_ENV) {
    console.log(`portChk1(disp) top=>${portCheck1Cnt}`);
  }


  var cribConnection = new sql.Connection(CONNECT.cribDefTO, function(err) {
    // ... error checks
    if(null==err){
      if ('development'==process.env.NODE_ENV) {
        console.log(`portChk1(disp) Connection Sucess`);
      }

      // Query
      let qry;
      if (MISC.PROD===true) {
        qry = `
          SELECT ROW_NUMBER() OVER(ORDER BY PONumber, Item) id,PONumber,RTrim(Item) Item,RTrim(ItemDescription) ItemDescription,RTrim(UDF_POCATEGORY) UDF_POCATEGORY
          FROM PODETAIL
          WHERE PONUMBER in
          (
            SELECT ponumber FROM [PO]  WHERE [PO].POSTATUSNO = 3 and [PO].SITEID <> '90'
          )
          and UDF_POCATEGORY is null
        `;
      }else{
        qry = `
          SELECT ROW_NUMBER() OVER(ORDER BY PONumber, Item) id,PONumber,RTrim(Item) Item,RTrim(ItemDescription) ItemDescription,RTrim(UDF_POCATEGORY) UDF_POCATEGORY
          FROM btPODETAIL
          WHERE PONUMBER in
          (
            SELECT ponumber FROM [btPO]  WHERE [btPO].POSTATUSNO = 3 and [btPO].SITEID <> '90'
          )
          and UDF_POCATEGORY is null
        `;
      }


      var request = new sql.Request(cribConnection); // or: var request = connection1.request();
      request.query(
      qry, function(err, recordset) {
          if(null==err){
            // ... error checks
            if ('development'==process.env.NODE_ENV) {
              console.log(`portChk1(disp) Query Sucess`);
              console.dir(recordset);
            }
            portCheck1Done=true;
            if(recordset.length!==0){
              let cribRsErr ="";
              recordset.forEach(function(podetail,i,arr){
                if ('development'==process.env.NODE_ENV) {
                  console.log(podetail.Item);
                }

                if(arr.length===i+1){
                  cribRsErr+=`PO# ${podetail.PONumber}, Item: ${podetail.Item}`;
                }else{
                  cribRsErr+= `PO# ${podetail.PONumber}, Item: ${podetail.Item}\n`;
                }
              });
              if ('development'==process.env.NODE_ENV) {
                console.log("Failed PO category check.");
              }

              dispatch({ type:PORTACTION.SET_NO_CAT_LIST, noCatList:recordset });
              dispatch({ type:PORTACTION.SET_CHECK1, chk1:PORTCHK.FAILURE });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_10_FAIL });
              dispatch({ type:PORTACTION.SET_STATUS, status:'Found PO(s) with missing Category...' });

            }else {
              contChecks=true;
              dispatch({ type:PORTACTION.SET_CHECK1, chk1:PORTCHK.SUCCESS });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.STEP_10_PASS });
            }
          }else{
            if(++portCheck1Cnt<3) {
              if ('development'==process.env.NODE_ENV) {
                console.log(`portChk1.query:  ${err.message}` );
                console.log(`portCheck1Cnt = ${portCheck1Cnt}`);
              }
            }else{
              dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
              dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
              portCheck1Failed=true;
            }
          }
        }
      );
    }else{
      if(++portCheck1Cnt<3) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`portChk1.Connection:  ${err.message}` );
          console.log(`portCheck1Cnt = ${portCheck1Cnt}`);
        }
      }else{
        dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
        dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
        portCheck1Failed=true;
      }
    }
  });
  
  cribConnection.on('error', function(err) {
    if(++portCheck1Cnt<3) {
      if ('development'==process.env.NODE_ENV) {
        console.log(`portChk1.on('error', function(err):  ${err.message}` );
        console.log(`portCheck1Cnt = ${portCheck1Cnt}`);
      }
    }else{
      dispatch({ type:PORTACTION.SET_REASON, reason:err.message });
      dispatch({ type:PORTACTION.SET_STATE, state:PORTSTATE.FAILURE });
      portCheck1Failed=true;
    }
  });
}


/*
insert into btpoitem
(
fpono, cribPO, fpartno,frev,fmeasure,fitemno,frelsno,
fcategory,fjoopno,flstcost,fstdcost,fleadtime,forgpdate,flstpdate,
fmultirls,fnextrels,fnqtydm,freqdate,fretqty,fordqty,fqtyutol,fqtyltol,
fbkordqty,flstsdate,frcpdate,frcpqty,fshpqty,finvqty,fdiscount,fstandard,
ftax,fsalestax,flcost,fucost,fprintmemo,fvlstcost,fvleadtime,fvmeasure,
fvptdes,fvordqty,fvconvfact,fvucost,fqtyshipr,fdateship,fnorgucost,
fnorgeurcost,fnorgtxncost,futxncost,fvueurocost,fvutxncost,fljrdif,
fucostonly,futxncston,fueurcston,fcomments,fdescript,fac,fndbrmod,
SchedDate,fsokey,fsoitm,fsorls,fjokey,fjoitm,frework,finspect,fvpartno,
fparentpo,frmano,fdebitmemo,finspcode,freceiver,fcorgcateg,fparentitm,fparentrls,frecvitm,
fueurocost,FCBIN,FCLOC,fcudrev,blanketPO,PlaceDate,DockTime,PurchBuf,Final,AvailDate
)
SELECT 
po.VendorPO fpono, po.PONumber cribPO, fpartno,frev,fmeasure,fitemno,frelsno,
fcategory,fjoopno,flstcost,fstdcost,fleadtime,forgpdate,flstpdate,
fmultirls,fnextrels,fnqtydm,freqdate,fretqty,fordqty,fqtyutol,fqtyltol,
fbkordqty,flstsdate,frcpdate,frcpqty,fshpqty,finvqty,fdiscount,fstandard,
ftax,fsalestax,flcost,fucost,fprintmemo,fvlstcost,fvleadtime,fvmeasure,
fvptdes,fvordqty,fvconvfact,fvucost,fqtyshipr,fdateship,fnorgucost,
fnorgeurcost,fnorgtxncost,futxncost,fvueurocost,fvutxncost,fljrdif,
fucostonly,futxncston,fueurcston,fcomments,fdescript,fac,fndbrmod,
SchedDate,fsokey,fsoitm,fsorls,fjokey,fjoitm,frework,finspect,fvpartno,
fparentpo,frmano,fdebitmemo,finspcode,freceiver,fcorgcateg,fparentitm,fparentrls,frecvitm,
fueurocost,FCBIN,FCLOC,fcudrev,blanketPO,PlaceDate,DockTime,PurchBuf,Final,AvailDate
FROM 
(
  SELECT PONumber,vendorPO
  FROM [btPO]  
  WHERE POSTATUSNO = 3 and SITEID <> '90' and (BLANKETPO = '' or BLANKETPO is null)

)po
inner join
(
  select
  '' fsokey,'' fsoitm,'' fsorls,'' fjokey,'' fjoitm,'' frework,'' finspect,'' fvpartno,'' fparentpo, 
  '' frmano,'' fdebitmemo,'' finspcode,'' freceiver,'' fcorgcateg,'' fparentitm,'' fparentrls,'' frecvitm,
  0.000 fueurocost,'' FCBIN,'' FCLOC,'' fcudrev,0 blanketPO,
  '1900-01-01 00:00:00.000' PlaceDate,0 DockTime,0 PurchBuf,0 Final,
  '1900-01-01 00:00:00.000' AvailDate,
  '1900-01-01 00:00:00.000' SchedDate,
  PONumber,ItemDescription fpartno,'NS' frev, 'EA' fmeasure, 
  case 
  when (row_number() over (PARTITION BY PONumber order by ItemDescription )) > 99 then cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
  when (row_number() over (PARTITION BY PONumber order by ItemDescription )) > 9 then ' ' + cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
  else '  ' + cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
  end as fitemno, '  0' frelsno,
  UDF_POCATEGORY fcategory,
  0 fjoopno,
  Cost flstcost,
  cost fstdcost,
  0 fleadtime,
  case
    when RequiredDate is null then GETDATE()
    else RequiredDate
  end as forgpdate,
  case
  when RequiredDate is null then GETDATE()
  else RequiredDate
  end as flstpdate,
  'N' fmultirls,
  0 fnextrels,
  0 fnqtydm,
  '1900-01-01 00:00:00.000' freqdate,
  0 fretqty,
  quantity fordqty,
  0 fqtyutol,
  0 fqtyltol,
  0 fbkordqty,
  '1900-01-01 00:00:00.000' flstsdate,
  '1900-01-01 00:00:00.000' frcpdate,
  0 frcpqty,
  0 fshpqty,
  0 finvqty,
  0 fdiscount,
  0 fstandard,
  'N' ftax,
  0 fsalestax,
  cost flcost,
  cost fucost,
  'Y' fprintmemo,
  cost fvlstcost,
  0 fvleadtime,
  'EA' fvmeasure,
  case
    when ITEM is null then ' '
    else ITEM
  end as fvptdes,
  Quantity fvordqty,
  1 fvconvfact,
  cost fvucost,
  0 fqtyshipr,
  '1900-01-01 00:00:00.000' fdateship,
  0 fnorgucost,
  0 fnorgeurcost,
  0 fnorgtxncost,
  0 futxncost,
  0 fvueurocost,
  0 fvutxncost,
  0 fljrdif,
  cost fucostonly,
  0 futxncston,
  0 fueurcston,
  case
    when Comments is null then ' '
    else Comments 
  end fcomments,
  case
    when Description2 is null then ' ' 
    else Description2
  end fdescript,
  'Default' fac,
  0 fndbrmod
  from btPODETAIL
) pod
on po.PONumber = pod.PONumber

update btPODetail
set vendorPONumber = po.VendorPO
from
btPODetail pod
inner join
btpo po
on
pod.ponumber=po.PONumber

update btPO
set POStatusNo = 0 
from btpo po
inner join
btpomast pom
on 
po.PONumber=pom.cribPO

end
*/