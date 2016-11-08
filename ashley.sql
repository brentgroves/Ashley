USE [Cribmaster]
GO

/*
bpGRDevGenRCMast
Generate one rcmast record for each vendorpo/date pair where items have been received since this sproc was last ran
*/
create procedure [dbo].[bpGRDevGenRCMast] 
	@currentReceiver as char(6)
AS
SET NOCOUNT ON
Declare @lastRun datetime
select @lastRun=flastrun from btgrvars
--Declare @currentReceiver int
--set @currentReceiver='283343'
insert into btrcmast
(
fclandcost
,frmano
,fporev
,fcstatus
,fdaterecv
,fpono
,freceiver
,fvendno
,faccptby
,fbilllad
,fcompany
,ffrtcarr
,fpacklist
,fretship
,fshipwgt
,ftype
,start
,fprinted
,flothrupd
,fccurid
,fcfactor
,fdcurdate
,fdeurodate
,feurofctr
,flpremcv
,docstatus
,frmacreator
)
--Declare @currentReceiver int
--set @currentReceiver='283343'
--Declare @lastRun datetime
--select @lastRun=flastrun from btgrvars
	select 
	'N' fclandcost
	,'' frmano
	,'00' fporev
	,'C' fcstatus
	,received fdaterecv
	,right(VendorPONumber,6) fpono
	,@currentReceiver -1 + row_number() over (order by VendorPONumber) as freceiver
	,UDFM2MVENDORNUMBER fvendno
	,'NS' faccptby
	,'' fbilllad
	, fcompany
	,'' ffrtcarr
	,'' fpacklist
	,'' fretship
	,0.00 fshipwgt
	,'P' ftype
	, DATEADD(DD, DATEDIFF(DD, 0, received), 0) start
	,0 fprinted
	,1 flothrupd
	,'' fccurid
	,0.00 fcfactor
	,'1900-01-01 00:00:00.000' fdcurdate
	,'1900-01-01 00:00:00.000' fdeurodate
	,0.00 feurofctr
	,0 flpremcv
	,'RECEIVED' docstatus
	,'' frmacreator
	from 
	(
		-- add various fields to base rcmast record
		select VendorPONumber, start,received, pod3.VendorNumber,
		vn1.UDFM2MVENDORNUMBER,apv.fccompany fcompany
		from 
		(
			-- select distinct po/date(s) with only one received time for each po/date combo
			select vendorponumber,start,max(VendorNumber) VendorNumber,max(received) received
			from 
			(
				-- select only the records not transfered yet
				select VendorPONumber, VendorNumber, id,DATEADD(DD, DATEDIFF(DD, 0, received), 0) start, received
				from btPODETAIL
				where Received > @lastRun
			) pod2
			group by VendorPONumber,start 
		) pod3
		inner join
		(
			select VendorNumber,UDFM2MVENDORNUMBER from vendor 
		)vn1
		on pod3.VendorNumber = vn1.VendorNumber
		inner join
		(
			select fvendno,fccompany from btapvend
		)apv
		on vn1.UDFM2MVENDORNUMBER=apv.fvendno
	)pd
	order by VendorPONumber desc

select ROW_NUMBER() OVER(ORDER BY fpono,start) id,LEFT(convert(varchar, start, 107),10) rcvdate,
* 
from 
btrcmast


/*
bpGRGenRCMast
Generate one rcmast record for each vendorpo/date pair where items have been received since this sproc was last ran
*/
create procedure [dbo].[bpGRGenRCMast] 
	@currentReceiver as char(6)
AS
SET NOCOUNT ON
Declare @lastRun datetime
select @lastRun=flastrun from btgrvars
--Declare @currentReceiver int
--set @currentReceiver='283343'
insert into btrcmast
(
fclandcost
,frmano
,fporev
,fcstatus
,fdaterecv
,fpono
,freceiver
,fvendno
,faccptby
,fbilllad
,fcompany
,ffrtcarr
,fpacklist
,fretship
,fshipwgt
,ftype
,start
,fprinted
,flothrupd
,fccurid
,fcfactor
,fdcurdate
,fdeurodate
,feurofctr
,flpremcv
,docstatus
,frmacreator
)
--Declare @currentReceiver int
--set @currentReceiver='283343'
--Declare @lastRun datetime
--select @lastRun=flastrun from btgrvars
	select 
	'N' fclandcost
	,'' frmano
	,'00' fporev
	,'C' fcstatus
	,received fdaterecv
	,right(VendorPONumber,6) fpono
	,@currentReceiver -1 + row_number() over (order by VendorPONumber) as freceiver
	,UDFM2MVENDORNUMBER fvendno
	,'NS' faccptby
	,'' fbilllad
	, fcompany
	,'' ffrtcarr
	,'' fpacklist
	,'' fretship
	,0.00 fshipwgt
	,'P' ftype
	, DATEADD(DD, DATEDIFF(DD, 0, received), 0) start
	,0 fprinted
	,1 flothrupd
	,'' fccurid
	,0.00 fcfactor
	,'1900-01-01 00:00:00.000' fdcurdate
	,'1900-01-01 00:00:00.000' fdeurodate
	,0.00 feurofctr
	,0 flpremcv
	,'RECEIVED' docstatus
	,'' frmacreator
	from 
	(
		-- add various fields to base rcmast record
		select VendorPONumber, start,received, pod3.VendorNumber,
		vn1.UDFM2MVENDORNUMBER,apv.fccompany fcompany
		from 
		(
			-- select distinct po/date(s) with only one received time for each po/date combo
			select vendorponumber,start,max(VendorNumber) VendorNumber,max(received) received
			from 
			(
				-- select only the records not transfered yet
				select VendorPONumber, VendorNumber, id,DATEADD(DD, DATEDIFF(DD, 0, received), 0) start, received
				from PODETAIL
				where Received > @lastRun
			) pod2
			group by VendorPONumber,start 
		) pod3
		inner join
		(
			select VendorNumber,UDFM2MVENDORNUMBER from vendor 
		)vn1
		on pod3.VendorNumber = vn1.VendorNumber
		inner join
		(
			select fvendno,fccompany from btapvend
		)apv
		on vn1.UDFM2MVENDORNUMBER=apv.fvendno
	)pd
	order by VendorPONumber desc

select ROW_NUMBER() OVER(ORDER BY fpono,start) id,LEFT(convert(varchar, start, 107),10) rcvdate,
* 
from 
btrcmast


create procedure [dbo].[bpDevPORT] 
	@currentPO as char(6)
AS
BEGIN
SET NOCOUNT ON
insert into btPOMast
(
fpono,cribpo,fcompany,fcshipto, forddate,fstatus,fvendno,fbuyer,
fchangeby,fshipvia, fcngdate, fcreate, ffob, fmethod, foldstatus, fordrevdt, 
fordtot,fpayterm,fpaytype,fporev,fprint,freqdate,freqsdt,freqsno, frevtot, 
fsalestax, ftax, fcsnaddrke, fnnextitem, fautoclose,fnusrqty1,fnusrcur1, fdusrdate1,fcfactor,
fdcurdate, fdeurodate, feurofctr, fctype, fmsnstreet, fpoclosing,fndbrmod, 
fcsncity, fcsnstate, fcsnzip, fcsncountr, fcsnphone,fcsnfax,fcshcompan,fcshcity,
fcshstate,fcshzip,fcshcountr,fcshphone,fcshfax,fmshstreet,
flpdate,fconfirm,fcontact,fcfname,fcshkey,fcshaddrke,fcusrchr1,fcusrchr2,fcusrchr3,
fccurid,fmpaytype,fmusrmemo1,freasoncng
)
select @currentPO -1 + row_number() over (order by PONumber)as fpono,PONumber cribpo,fccompany fcompany,
'SELF' fcshipto, PODate forddate,'OPEN' fstatus,UDFM2MVENDORNUMBER fvendno,'CM' fbuyer,
'CM' fchangeby,'UPS-OURS' fshipvia, PODate fcngdate,PODate fcreate,
'OUR PLANT' ffob,'1' fmethod,'STARTED' foldstatus,'1900-01-01 00:00:00.000' fordrevdt, 
0 fordtot,fcterms fpayterm,'3' fpaytype, '00' fporev,'N' fprint,'1900-01-01 00:00:00.000' freqdate,
PODate freqsdt,'' freqsno, 0 frevtot, 0 fsalestax, 'N' ftax, '0001' fcsnaddrke, 1 fnnextitem,
'Y' fautoclose,0 fnusrqty1,0 fnusrcur1,'1900-01-01 00:00:00.000' fdusrdate1,0 fcfactor,
'1900-01-01 00:00:00.000' fdcurdate,'1900-01-01 00:00:00.000' fdeurodate,0 feurofctr,'O' fctype,
fmstreet fmsnstreet,
'Please reference our purchase order number on all correspondence.  ' +
'Notification of changes regarding quantities to be shipped and changes in the delivery schedule are required.' + 
CHAR(13) + CHAR(13) + 
'PO APPROVALS:' + CHAR(13) + CHAR(13) +
'Requr. _______________________________________' + CHAR(13) + 
'Dept. Head ___________________________________' + CHAR(13) + CHAR(13) + 
'G.M. Only: All Items Over $500.00' + CHAR(13) + 
'G.M ________________________________________' + CHAR(13) + 
'VP/Group Controller. Only: All Assests/CER and ER Over $10,000.00' + CHAR(13) + 
'VP/Group Controller _____________________________________' + CHAR(13) + 
'Pres. Only: All Assets/CER/ER and/or PO''s Over $10,000.00' + CHAR(13) + 
'President _____________________________________' fpoclosing,0 fndbrmod,
fccity fcsncity,fcstate fcsnstate,fczip fcsnzip, fccountry fcsncountr,fcphone fcsnphone,fcfax fcsnfax,
'BUSCHE INDIANA' fcshcompan,'ALBION' fcshcity,'IN' fcshstate,'46701' fcshzip,'USA' fcshcountr,
'2606367030' fcshphone, '2606367031' fcshfax,'1563 E. State Road 8' fmshstreet,
'1900-01-01 00:00:00.000' flpdate,'' fconfirm,'' fcontact,'' fcfname,'' fcshkey,'' fcshaddrke,
'' fcusrchr1,'' fcusrchr2,'' fcusrchr3,'' fccurid,'' fmpaytype,'' fmusrmemo1,'Automatic closure.' freasoncng 
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
	SELECT fvendno,fcterms,fccompany,fccity,fcstate,fczip,fccountry,fcphone,fcfax,fmstreet FROM btapvend  
)av1
on vn1.UDFM2MVENDORNUMBER=av1.fvendno

update btPO
set btPO.VendorPO = pom.fpono
--select po.ponumber,pom.cribpo,pom.fpono,po.vendorpo
from [btPO] po 
inner join
btpomast pom
on 
po.PONumber=pom.cribPO
WHERE POSTATUSNO = 3 and SITEID <> '90' and (BLANKETPO = '' or BLANKETPO is null)

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
	PONumber,left(ItemDescription,25) fpartno,'NS' frev, 'EA' fmeasure, 
	case 
	when (row_number() over (PARTITION BY PONumber order by ItemDescription )) > 99 then cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
	when (row_number() over (PARTITION BY PONumber order by ItemDescription )) > 9 then ' ' + cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
	else '  ' + cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
	end	as fitemno, '  0' frelsno,
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
[btPO]  po
on
pod.ponumber=po.PONumber
WHERE POSTATUSNO = 3 and SITEID <> '90' and (po.BLANKETPO = '' or po.BLANKETPO is null)


end


create procedure [dbo].[bpPORT] 
	@currentPO as char(6)
AS
BEGIN
SET NOCOUNT ON
insert into btpomast
(
fpono,cribpo,fcompany,fcshipto, forddate,fstatus,fvendno,fbuyer,
fchangeby,fshipvia, fcngdate, fcreate, ffob, fmethod, foldstatus, fordrevdt, 
fordtot,fpayterm,fpaytype,fporev,fprint,freqdate,freqsdt,freqsno, frevtot, 
fsalestax, ftax, fcsnaddrke, fnnextitem, fautoclose,fnusrqty1,fnusrcur1, fdusrdate1,fcfactor,
fdcurdate, fdeurodate, feurofctr, fctype, fmsnstreet, fpoclosing,fndbrmod, 
fcsncity, fcsnstate, fcsnzip, fcsncountr, fcsnphone,fcsnfax,fcshcompan,fcshcity,
fcshstate,fcshzip,fcshcountr,fcshphone,fcshfax,fmshstreet,
flpdate,fconfirm,fcontact,fcfname,fcshkey,fcshaddrke,fcusrchr1,fcusrchr2,fcusrchr3,
fccurid,fmpaytype,fmusrmemo1,freasoncng
)
select @currentPO -1 + row_number() over (order by PONumber)as fpono,PONumber cribpo,fccompany fcompany,
'SELF' fcshipto, PODate forddate,'OPEN' fstatus,UDFM2MVENDORNUMBER fvendno,'CM' fbuyer,
'CM' fchangeby,'UPS-OURS' fshipvia, PODate fcngdate,PODate fcreate,
'OUR PLANT' ffob,'1' fmethod,'STARTED' foldstatus,'1900-01-01 00:00:00.000' fordrevdt, 
0 fordtot,fcterms fpayterm,'3' fpaytype, '00' fporev,'N' fprint,'1900-01-01 00:00:00.000' freqdate,
PODate freqsdt,'' freqsno, 0 frevtot, 0 fsalestax, 'N' ftax, '0001' fcsnaddrke, 1 fnnextitem,
'Y' fautoclose,0 fnusrqty1,0 fnusrcur1,'1900-01-01 00:00:00.000' fdusrdate1,0 fcfactor,
'1900-01-01 00:00:00.000' fdcurdate,'1900-01-01 00:00:00.000' fdeurodate,0 feurofctr,'O' fctype,
fmstreet fmsnstreet,
'Please reference our purchase order number on all correspondence.  ' +
'Notification of changes regarding quantities to be shipped and changes in the delivery schedule are required.' + 
CHAR(13) + CHAR(13) + 
'PO APPROVALS:' + CHAR(13) + CHAR(13) +
'Requr. _______________________________________' + CHAR(13) + 
'Dept. Head ___________________________________' + CHAR(13) + CHAR(13) + 
'G.M. Only: All Items Over $500.00' + CHAR(13) + 
'G.M ________________________________________' + CHAR(13) + 
'VP/Group Controller. Only: All Assests/CER and ER Over $10,000.00' + CHAR(13) + 
'VP/Group Controller _____________________________________' + CHAR(13) + 
'Pres. Only: All Assets/CER/ER and/or PO''s Over $10,000.00' + CHAR(13) + 
'President _____________________________________' fpoclosing,0 fndbrmod,
fccity fcsncity,fcstate fcsnstate,fczip fcsnzip, fccountry fcsncountr,fcphone fcsnphone,fcfax fcsnfax,
'BUSCHE INDIANA' fcshcompan,'ALBION' fcshcity,'IN' fcshstate,'46701' fcshzip,'USA' fcshcountr,
'2606367030' fcshphone, '2606367031' fcshfax,'1563 E. State Road 8' fmshstreet,
'1900-01-01 00:00:00.000' flpdate,'' fconfirm,'' fcontact,'' fcfname,'' fcshkey,'' fcshaddrke,
'' fcusrchr1,'' fcusrchr2,'' fcusrchr3,'' fccurid,'' fmpaytype,'' fmusrmemo1,'Automatic closure.' freasoncng 
from 
(
	SELECT PONumber,Vendor,PODate 
	FROM [PO]  
	WHERE POSTATUSNO = 3 and SITEID <> '90' and (BLANKETPO = '' or BLANKETPO is null)
)po1
inner join 
(
	select VendorNumber,UDFM2MVENDORNUMBER from vendor 
)vn1
on po1.Vendor = vn1.VendorNumber
inner join
(
	SELECT fvendno,fcterms,fccompany,fccity,fcstate,fczip,fccountry,fcphone,fcfax,fmstreet FROM btapvend  
)av1
on vn1.UDFM2MVENDORNUMBER=av1.fvendno

update PO
set PO.VendorPO = pom.fpono
--select po.ponumber,pom.cribpo,pom.fpono,po.vendorpo
from [PO] po 
inner join
btpomast pom
on 
po.PONumber=pom.cribPO
WHERE POSTATUSNO = 3 and SITEID <> '90' and (BLANKETPO = '' or BLANKETPO is null)

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
	FROM [PO]  
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
	PONumber,left(ItemDescription,25) fpartno,'NS' frev, 'EA' fmeasure, 
	case 
	when (row_number() over (PARTITION BY PONumber order by ItemDescription )) > 99 then cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
	when (row_number() over (PARTITION BY PONumber order by ItemDescription )) > 9 then ' ' + cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
	else '  ' + cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
	end	as fitemno, '  0' frelsno,
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
	from PODETAIL
) pod
on po.PONumber = pod.PONumber

update PODetail
set vendorPONumber = po.VendorPO
from
PODetail pod
inner join
[PO]  po
on
pod.ponumber=po.PONumber
WHERE POSTATUSNO = 3 and SITEID <> '90' and (po.BLANKETPO = '' or po.BLANKETPO is null)


end

GO

USE [Cribmaster]
GO


--///////////////////////////////////////////
-- Delete all pomast and poitem records in range
--////////////////////////////////////////////////
create procedure [dbo].[bpDelPOMastAndPOItem] 
@postart char(6),
@poend char(6)
as
begin
	Declare @start int,@end int,
	@ret int
	set @start= CAST(@postart AS int)
	set @end= CAST(@poend AS int)
--select @start,@end
--select (@end-@start)
	set @ret =
	CASE
		WHEN ((@end-@start)<250) THEN 0
		else -1
	END
--select @ret
	IF (0=@ret)
	BEGIN
		delete from btpomast
		where fpono >=@postart and fpono <=@poend 
		delete from btpoitem
		where fpono >=@postart and fpono <=@poend
	END
end

USE [Cribmaster]
GO

--///////////////////////////////////////////
-- Delete all pomast and poitem records in range
--////////////////////////////////////////////////
create procedure [dbo].[bpDevDelPOMastAndPOItem] 
@postart char(6),
@poend char(6)
as
begin
	Declare @start int,@end int,
	@ret int
	set @start= CAST(@postart AS int)
	set @end= CAST(@poend AS int)
--select @start,@end
--select (@end-@start)
	set @ret =
	CASE
		WHEN ((@end-@start)<250) THEN 0
		else -1
	END
--select @ret
	IF (0=@ret)
	BEGIN
		delete from btpomast
		where fpono >=@postart and fpono <=@poend 
		delete from btpoitem
		where fpono >=@postart and fpono <=@poend
	END
end

GO

USE [Cribmaster]
GO

--///////////////////////////////////////////
-- Delete all pomast and poitem records in range and 
-- change postatusno to open and update portlog
--////////////////////////////////////////////////
create procedure [dbo].[bpDelPOMastAndPOItemAndPOStatus] 
@postart char(6),
@poend char(6),
@logId int
as
begin
	Declare @start int,@end int,
	@ret int
	set @start= CAST(@postart AS int)
	set @end= CAST(@poend AS int)
--select @start,@end
--select (@end-@start)
	set @ret =
	CASE
		WHEN ((@end-@start)<250) THEN 0
		else -1
	END
--select @ret
	IF (0=@ret)
	BEGIN
	BEGIN TRANSACTION;
		delete from btpomast
		where fpono >=@postart and fpono <=@poend 

		delete from btpoitem
		where fpono >=@postart and fpono <=@poend

        update PO
        set POStatusNo = 0 
        WHERE POSTATUSNO = 3 and SITEID <> '90' and (BLANKETPO = '' or BLANKETPO is null)

		update [dbo].[btPORTLog]
		set fEnd=GETDATE()
		where id=@logId
	COMMIT;  
	END
end

GO

USE [Cribmaster]
GO


--///////////////////////////////////////////
-- Delete all pomast and poitem records in range and 
-- change postatusno to open and update portLog
--////////////////////////////////////////////////
create procedure [dbo].[bpDevDelPOMastAndPOItemAndPOStatus] 
@postart char(6),
@poend char(6),
@logId int
as
begin
	Declare @start int,@end int,
	@ret int
	set @start= CAST(@postart AS int)
	set @end= CAST(@poend AS int)
--select @start,@end
--select (@end-@start)
	set @ret =
	CASE
		WHEN ((@end-@start)<250) THEN 0
		else -1
	END
--select @ret
	IF (0=@ret)
	BEGIN
	BEGIN TRANSACTION;
		delete from btpomast
		where fpono >=@postart and fpono <=@poend 

		delete from btpoitem
		where fpono >=@postart and fpono <=@poend

        update btPO
        set POStatusNo = 0 
        WHERE POSTATUSNO = 3 and SITEID <> '90' and (BLANKETPO = '' or BLANKETPO is null)

		update [dbo].[btPORTLog]
		set fEnd=GETDATE()
		where id=@logId
	COMMIT;  
	END
end

GO
create procedure [dbo].[bpDevInsPORTLog]
@id int output
AS
BEGIN
 SET NOCOUNT ON
	INSERT INTO [dbo].[btPORTLog]
			   (fRollBack,fStart)
		 VALUES
			   (0,GETDATE())
	select @id=max(id) from btPORTLog
end


USE [Cribmaster]
GO

create procedure [dbo].[bpInsPORTLog]
@id int output
AS
BEGIN
 SET NOCOUNT ON
	INSERT INTO [dbo].[btPORTLog]
			   (fRollBack,fStart)
		 VALUES
			   (0,GETDATE())
	select @id=max(id) from btPORTLog
end

GO

USE [m2mdata01]
GO

create procedure [dbo].[bpPOItemInsert] 
@fpono char(6),
@fpartno char(25),
@frev char(3),
@fmeasure char(3),
@fitemno char(3),
@frelsno char(3),
@fcategory char(8),
@fjoopno int,
@flstcost M2MMoney,
@fstdcost M2MMoney,
@fleadtime numeric(5, 1),
@forgpdate datetime,
@flstpdate datetime,
@fmultirls char(1),
@fnextrels int,
@fnqtydm numeric(15, 5),
@freqdate datetime,
@fretqty numeric(15, 5),
@fordqty numeric(15, 5),
@fqtyutol numeric(6, 2),
@fqtyltol numeric(6, 2),
@fbkordqty numeric(15, 5),
@flstsdate datetime,
@frcpdate datetime,
@frcpqty numeric(15, 5),
@fshpqty numeric(15, 5),
@finvqty numeric(15, 5),
@fdiscount numeric(5, 1),
@fstandard bit,

@ftax char(1),
@fsalestax numeric(7, 3),
@flcost M2MMoney,
@fucost M2MMoney,
@fprintmemo char(1),
@fvlstcost M2MMoney,
@fvleadtime numeric(5, 1),
@fvmeasure char(5),

@fvptdes varchar(35),
@fvordqty numeric(15, 5),
@fvconvfact numeric(13, 9),
@fvucost M2MMoney,
@fqtyshipr numeric(15, 5),
@fdateship datetime,
@fnorgucost M2MMoney,
@fnorgeurcost M2MMoney,
@fnorgtxncost M2MMoney,
@futxncost M2MMoney,
@fvueurocost M2MMoney,
@fvutxncost M2MMoney,
@fljrdif bit,
@fucostonly M2MMoney,
@futxncston M2MMoney,
@fueurcston M2MMoney,
@fcomments text,
@fdescript text,
@Fac M2MFacility,
@fndbrmod int,
@SchedDate datetime,
@fsokey char(6),
@fsoitm char(3),
@fsorls char(3),
@fjokey char(10),
@fjoitm char(6),
@frework char(1),
@finspect char(1),
@fvpartno char(25),
@fparentpo char(6),
@frmano char(25),
@fdebitmemo char(1),
@finspcode char(4),
@freceiver char(6),
@fcorgcateg char(19),
@fparentitm char(3),
@fparentrls char(3),
@frecvitm char(3),
@fueurocost M2MMoney,
@FCBIN char(14),
@FCLOC char(14),
@fcudrev char(3),
@blanketPO bit,
@PlaceDate datetime,
@DockTime int,
@PurchBuf int,
@Final bit,
@AvailDate datetime
AS
BEGIN
insert into poitem
(
fpono, fpartno,frev,fmeasure,fitemno,frelsno,
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
values
(
@fpono,@fpartno,@frev,@fmeasure,@fitemno,@frelsno,
@fcategory,@fjoopno,@flstcost,@fstdcost,@fleadtime,@forgpdate,@flstpdate,
@fmultirls,@fnextrels,@fnqtydm,@freqdate,@fretqty,@fordqty,@fqtyutol,@fqtyltol,
@fbkordqty,@flstsdate,@frcpdate,@frcpqty,@fshpqty,@finvqty,@fdiscount,@fstandard,
@ftax,@fsalestax,@flcost,@fucost,@fprintmemo,@fvlstcost,@fvleadtime,@fvmeasure,
@fvptdes,@fvordqty,@fvconvfact,@fvucost,@fqtyshipr,@fdateship,@fnorgucost,
@fnorgeurcost,@fnorgtxncost,@futxncost,@fvueurocost,@fvutxncost,@fljrdif,
@fucostonly,@futxncston,@fueurcston,@fcomments,@fdescript,@fac,@fndbrmod,
@SchedDate,@fsokey,@fsoitm,@fsorls,@fjokey,@fjoitm,@frework,@finspect,@fvpartno,
@fparentpo,@frmano,@fdebitmemo,@finspcode,@freceiver,@fcorgcateg,@fparentitm,@fparentrls,@frecvitm,
@fueurocost,@FCBIN,@FCLOC,@fcudrev,@blanketPO,@PlaceDate,@DockTime,@PurchBuf,@Final,@AvailDate
)
END

GO

USE [m2mdata01]
GO


create procedure [dbo].[bpDevPOItemInsert] 
@fpono char(6),
@fpartno char(25),
@frev char(3),
@fmeasure char(3),
@fitemno char(3),
@frelsno char(3),
@fcategory char(8),
@fjoopno int,
@flstcost M2MMoney,
@fstdcost M2MMoney,
@fleadtime numeric(5, 1),
@forgpdate datetime,
@flstpdate datetime,
@fmultirls char(1),
@fnextrels int,
@fnqtydm numeric(15, 5),
@freqdate datetime,
@fretqty numeric(15, 5),
@fordqty numeric(15, 5),
@fqtyutol numeric(6, 2),
@fqtyltol numeric(6, 2),
@fbkordqty numeric(15, 5),
@flstsdate datetime,
@frcpdate datetime,
@frcpqty numeric(15, 5),
@fshpqty numeric(15, 5),
@finvqty numeric(15, 5),
@fdiscount numeric(5, 1),
@fstandard bit,

@ftax char(1),
@fsalestax numeric(7, 3),
@flcost M2MMoney,
@fucost M2MMoney,
@fprintmemo char(1),
@fvlstcost M2MMoney,
@fvleadtime numeric(5, 1),
@fvmeasure char(5),

@fvptdes varchar(35),
@fvordqty numeric(15, 5),
@fvconvfact numeric(13, 9),
@fvucost M2MMoney,
@fqtyshipr numeric(15, 5),
@fdateship datetime,
@fnorgucost M2MMoney,
@fnorgeurcost M2MMoney,
@fnorgtxncost M2MMoney,
@futxncost M2MMoney,
@fvueurocost M2MMoney,
@fvutxncost M2MMoney,
@fljrdif bit,
@fucostonly M2MMoney,
@futxncston M2MMoney,
@fueurcston M2MMoney,
@fcomments text,
@fdescript text,
@Fac M2MFacility,
@fndbrmod int,
@SchedDate datetime,
@fsokey char(6),
@fsoitm char(3),
@fsorls char(3),
@fjokey char(10),
@fjoitm char(6),
@frework char(1),
@finspect char(1),
@fvpartno char(25),
@fparentpo char(6),
@frmano char(25),
@fdebitmemo char(1),
@finspcode char(4),
@freceiver char(6),
@fcorgcateg char(19),
@fparentitm char(3),
@fparentrls char(3),
@frecvitm char(3),
@fueurocost M2MMoney,
@FCBIN char(14),
@FCLOC char(14),
@fcudrev char(3),
@blanketPO bit,
@PlaceDate datetime,
@DockTime int,
@PurchBuf int,
@Final bit,
@AvailDate datetime
AS
BEGIN
insert into btpoitem
(
fpono, fpartno,frev,fmeasure,fitemno,frelsno,
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
values
(
@fpono,@fpartno,@frev,@fmeasure,@fitemno,@frelsno,
@fcategory,@fjoopno,@flstcost,@fstdcost,@fleadtime,@forgpdate,@flstpdate,
@fmultirls,@fnextrels,@fnqtydm,@freqdate,@fretqty,@fordqty,@fqtyutol,@fqtyltol,
@fbkordqty,@flstsdate,@frcpdate,@frcpqty,@fshpqty,@finvqty,@fdiscount,@fstandard,
@ftax,@fsalestax,@flcost,@fucost,@fprintmemo,@fvlstcost,@fvleadtime,@fvmeasure,
@fvptdes,@fvordqty,@fvconvfact,@fvucost,@fqtyshipr,@fdateship,@fnorgucost,
@fnorgeurcost,@fnorgtxncost,@futxncost,@fvueurocost,@fvutxncost,@fljrdif,
@fucostonly,@futxncston,@fueurcston,@fcomments,@fdescript,@fac,@fndbrmod,
@SchedDate,@fsokey,@fsoitm,@fsorls,@fjokey,@fjoitm,@frework,@finspect,@fvpartno,
@fparentpo,@frmano,@fdebitmemo,@finspcode,@freceiver,@fcorgcateg,@fparentitm,@fparentrls,@frecvitm,
@fueurocost,@FCBIN,@FCLOC,@fcudrev,@blanketPO,@PlaceDate,@DockTime,@PurchBuf,@Final,@AvailDate
)
END

GO


USE [m2mdata01]
GO

create procedure [dbo].[bpPOMastInsert] 
@fpono as char(6),
@fcompany as varchar(35),
@fcshipto as char(8),
@forddate as datetime,
@fstatus as char(20),
@fvendno as char(6),
@fbuyer as char(3),
@fchangeby as char(25),
@fshipvia as char(20),
@fcngdate as datetime,
@fcreate as datetime,
@ffob as char(20),
@fmethod as char(1),
@foldstatus as char(20),
@fordrevdt as datetime,
@fordtot as numeric(15, 5),
@fpayterm as char(4),
@fpaytype as char(1),
@fporev as char(2),
@fprint as char(1),
@freqdate as datetime,
@freqsdt as datetime,
@freqsno as char(6), 
@frevtot as numeric(15, 5),
@fsalestax as numeric(7, 3), 
@ftax as char(1), 
@fcsnaddrke as char(4), 
@fnnextitem as int, 
@fautoclose as char(1),
@fnusrqty1 as M2MMoney,
@fnusrcur1 as money, 
@fdusrdate1 as datetime,
@fcfactor as M2MMoney,
@fdcurdate as datetime,
@fdeurodate as datetime,
@feurofctr as M2MMoney,
@fctype char(1),
@fmsnstreet text,
@fpoclosing text,
@fndbrmod int,
@fcsncity char(20),
@fcsnstate char(20),
@fcsnzip char(10),
@fcsncountr char(25),
@fcsnphone char(20),
@fcsnfax char(20),
@fcshcompan varchar(35),
@fcshcity char(20),
@fcshstate char(20),
@fcshzip char(10),
@fcshcountr char(25),
@fcshphone char(20),
@fcshfax char(20),
@fmshstreet text,
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
AS
BEGIN
insert into pomast
(
fpono,fcompany,fcshipto, forddate,fstatus,fvendno,fbuyer,
fchangeby,fshipvia, fcngdate, fcreate, ffob, fmethod, foldstatus, fordrevdt, 
fordtot,fpayterm,fpaytype,fporev,fprint,freqdate,freqsdt,freqsno, frevtot, 
fsalestax, ftax, fcsnaddrke, fnnextitem, fautoclose,fnusrqty1,fnusrcur1, fdusrdate1,fcfactor,
fdcurdate, fdeurodate, feurofctr, fctype, fmsnstreet, fpoclosing,fndbrmod, 
fcsncity, fcsnstate, fcsnzip, fcsncountr, fcsnphone,fcsnfax,fcshcompan,fcshcity,
fcshstate,fcshzip,fcshcountr,fcshphone,fcshfax,fmshstreet,
flpdate,fconfirm,fcontact,fcfname,fcshkey,fcshaddrke,fcusrchr1,fcusrchr2,fcusrchr3,
fccurid,fmpaytype,fmusrmemo1,freasoncng
)
values
(
@fpono,@fcompany,@fcshipto,@forddate,@fstatus,@fvendno,@fbuyer,
@fchangeby,@fshipvia,@fcngdate,@fcreate,@ffob,@fmethod,@foldstatus,@fordrevdt, 
@fordtot,@fpayterm,@fpaytype,@fporev,@fprint,@freqdate,@freqsdt,@freqsno,@frevtot, 
@fsalestax,@ftax,@fcsnaddrke,@fnnextitem,@fautoclose,@fnusrqty1,@fnusrcur1,@fdusrdate1,@fcfactor,
@fdcurdate,@fdeurodate,@feurofctr,@fctype,@fmsnstreet,@fpoclosing,@fndbrmod,
@fcsncity,@fcsnstate,@fcsnzip,@fcsncountr,@fcsnphone,@fcsnfax,rtrim(@fcshcompan),@fcshcity,
@fcshstate,@fcshzip,@fcshcountr,@fcshphone,@fcshfax,@fmshstreet,
@flpdate,@fconfirm,@fcontact,@fcfname,@fcshkey,@fcshaddrke,@fcusrchr1,@fcusrchr2,@fcusrchr3,
@fccurid,@fmpaytype,@fmusrmemo1,@freasoncng
)
END
GO


USE [m2mdata01]
GO

create procedure [dbo].[bpDevPOMastInsert] 
@fpono as char(6),
@fcompany as varchar(35),
@fcshipto as char(8),
@forddate as datetime,
@fstatus as char(20),
@fvendno as char(6),
@fbuyer as char(3),
@fchangeby as char(25),
@fshipvia as char(20),
@fcngdate as datetime,
@fcreate as datetime,
@ffob as char(20),
@fmethod as char(1),
@foldstatus as char(20),
@fordrevdt as datetime,
@fordtot as numeric(15, 5),
@fpayterm as char(4),
@fpaytype as char(1),
@fporev as char(2),
@fprint as char(1),
@freqdate as datetime,
@freqsdt as datetime,
@freqsno as char(6), 
@frevtot as numeric(15, 5),
@fsalestax as numeric(7, 3), 
@ftax as char(1), 
@fcsnaddrke as char(4), 
@fnnextitem as int, 
@fautoclose as char(1),
@fnusrqty1 as M2MMoney,
@fnusrcur1 as money, 
@fdusrdate1 as datetime,
@fcfactor as M2MMoney,
@fdcurdate as datetime,
@fdeurodate as datetime,
@feurofctr as M2MMoney,
@fctype char(1),
@fmsnstreet text,
@fpoclosing text,
@fndbrmod int,
@fcsncity char(20),
@fcsnstate char(20),
@fcsnzip char(10),
@fcsncountr char(25),
@fcsnphone char(20),
@fcsnfax char(20),
@fcshcompan varchar(35),
@fcshcity char(20),
@fcshstate char(20),
@fcshzip char(10),
@fcshcountr char(25),
@fcshphone char(20),
@fcshfax char(20),
@fmshstreet text,
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
AS
BEGIN
insert into btpomast
(
fpono,fcompany,fcshipto, forddate,fstatus,fvendno,fbuyer,
fchangeby,fshipvia, fcngdate, fcreate, ffob, fmethod, foldstatus, fordrevdt, 
fordtot,fpayterm,fpaytype,fporev,fprint,freqdate,freqsdt,freqsno, frevtot, 
fsalestax, ftax, fcsnaddrke, fnnextitem, fautoclose,fnusrqty1,fnusrcur1, fdusrdate1,fcfactor,
fdcurdate, fdeurodate, feurofctr, fctype, fmsnstreet, fpoclosing,fndbrmod, 
fcsncity, fcsnstate, fcsnzip, fcsncountr, fcsnphone,fcsnfax,fcshcompan,fcshcity,
fcshstate,fcshzip,fcshcountr,fcshphone,fcshfax,fmshstreet,
flpdate,fconfirm,fcontact,fcfname,fcshkey,fcshaddrke,fcusrchr1,fcusrchr2,fcusrchr3,
fccurid,fmpaytype,fmusrmemo1,freasoncng
)
values
(
@fpono,@fcompany,@fcshipto,@forddate,@fstatus,@fvendno,@fbuyer,
@fchangeby,@fshipvia,@fcngdate,@fcreate,@ffob,@fmethod,@foldstatus,@fordrevdt, 
@fordtot,@fpayterm,@fpaytype,@fporev,@fprint,@freqdate,@freqsdt,@freqsno,@frevtot, 
@fsalestax,@ftax,@fcsnaddrke,@fnnextitem,@fautoclose,@fnusrqty1,@fnusrcur1,@fdusrdate1,@fcfactor,
@fdcurdate,@fdeurodate,@feurofctr,@fctype,@fmsnstreet,@fpoclosing,@fndbrmod,
@fcsncity,@fcsnstate,@fcsnzip,@fcsncountr,@fcsnphone,@fcsnfax,rtrim(@fcshcompan),@fcshcity,
@fcshstate,@fcshzip,@fcshcountr,@fcshphone,@fcshfax,@fmshstreet,
@flpdate,@fconfirm,@fcontact,@fcfname,@fcshkey,@fcshaddrke,@fcusrchr1,@fcusrchr2,@fcusrchr3,
@fccurid,@fmpaytype,@fmusrmemo1,@freasoncng
)
END

GO

USE [Cribmaster]
GO

create procedure [dbo].[bpPORTPOMastRange]
@postart int output,
@poend int output
AS
BEGIN
 SET NOCOUNT ON
select @postart=min(fpono) from btpomast
select @poend=max(fpono) from btpomast
IF (@postart IS NULL)
 BEGIN
   set @postart = 0
 END
IF (@poend IS NULL)
 BEGIN
   set @poend = 0
 END

RETURN
END


GO


USE [Cribmaster]
GO

create procedure [dbo].[bpDevPORTPOMastRange]
@postart int output,
@poend int output
AS
BEGIN
 SET NOCOUNT ON
select @postart=min(fpono) from btpomast
select @poend=max(fpono) from btpomast
--set @postart=1
--set @poend=5
IF (@postart IS NULL)
 BEGIN
   set @postart = 0
 END
IF (@poend IS NULL)
 BEGIN
   set @poend = 0
 END

RETURN
END


GO

USE [Cribmaster]
GO

--///////////////////////////////////////////////////////////////////////////////////
-- Update PO and PODetail vendor number
--///////////////////////////////////////////////////////////////////////////////////
create PROCEDURE [dbo].[bpPOVendorUpdate] 
 @poNumber int,
 @vendor varchar(12),
 @Address1 varchar(50),
 @Address2 varchar(50),
 @Address3 varchar(50),
 @Address4 varchar(50)
AS
BEGIN
	SET NOCOUNT ON
	update PO
	set vendor = @vendor,
	Address1=@Address1,
	Address2=@Address2,
	Address3=@Address3,
	Address4=@Address4
	where 
	PONumber = @poNumber 

	update PODETAIL
	set VendorNumber = @vendor
	where 
	PONumber = @poNumber 

end

GO

USE [Cribmaster]
GO

--///////////////////////////////////////////////////////////////////////////////////
-- Update PO and PODetail vendor number
--///////////////////////////////////////////////////////////////////////////////////
create PROCEDURE [dbo].[bpDevPOVendorUpdate] 
 @poNumber int,
 @vendor varchar(12),
 @Address1 varchar(50),
 @Address2 varchar(50),
 @Address3 varchar(50),
 @Address4 varchar(50)
AS
BEGIN
	SET NOCOUNT ON
	update btPO
	set vendor = @vendor,
	Address1=@Address1,
	Address2=@Address2,
	Address3=@Address3,
	Address4=@Address4
	where 
	PONumber = @poNumber 

	update btPODETAIL
	set VendorNumber = @vendor
	where 
	PONumber = @poNumber 

end

GO


USE [Cribmaster]
GO

--///////////////////////////////////////////////////////////////////////////////////
-- Update UDFM2MVENDORNUMBER field of Vendor
--///////////////////////////////////////////////////////////////////////////////////
create PROCEDURE [dbo].[bpVendorUpdate] 
 @vendorNumber varchar(12),
 @newM2mVendor varchar(6)
AS
BEGIN
	SET NOCOUNT ON
	update Vendor
	set UDFM2MVENDORNUMBER = @newM2mVendor
	where 
	VendorNumber = @vendorNumber 
end

GO


USE [Cribmaster]
GO

--///////////////////////////////////////////////////////////////////////////////////
-- Update UDFM2MVENDORNUMBER field of btVendor
--///////////////////////////////////////////////////////////////////////////////////
create PROCEDURE [dbo].[bpDevVendorUpdate] 
 @vendorNumber varchar(12),
 @newM2mVendor varchar(6)
AS
BEGIN
	SET NOCOUNT ON
	update btVendor
	set UDFM2MVENDORNUMBER = @newM2mVendor
	where 
	VendorNumber = @vendorNumber 
end

GO

