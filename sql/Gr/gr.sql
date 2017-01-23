USE [Cribmaster]
GO


CREATE TABLE [dbo].[btGRLog](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[VerCol] [timestamp] NOT NULL,
	[fStart] [datetime] NOT NULL,
	[fStep] [varchar](50) NOT NULL,
	[rcvStart] [char](6) NULL,
	[rcvEnd] [char](6) NULL,
	[fEnd] [datetime] NULL
) ON [PRIMARY]

GO

USE [Cribmaster]
GO

/*
bpGRGetLogEntryLast
Retreive the latest log entry
*/
create procedure [dbo].[bpGRGetLogEntryLast] 
	@id as int output,
	@fStart as datetime output,
	@fStep as varchar(50) output,
	@rcvStart as char(6) output,
	@rcvEnd as char(6) output,
	@fEnd as datetime output
AS

Declare @maxId integer
select @maxId=max(id) from btGRLog 
select 
	@id=id,
	@fStart=fStart,
	@fStep=fStep,
	@rcvStart=rcvStart,
	@rcvEnd=rcvEnd,
	@fEnd=fEnd
from btGRLog
where id = @maxId 


GO
USE [Cribmaster]
GO

--///////////////////////////////////////////////////////////
-- 1. If @delrc = 1 then Delete All btrcmast and btrcitem records
-- 2. process ending datetime in btGRLog and set fStep to @step
--//////////////////////////////////////////
create procedure [dbo].[bpGRFinish]
@delrc bit,
@step varchar(50)
as
if 1 = @delrc 
begin
delete from btrcitem
delete from btrcmast
end

Declare @maxId integer
select @maxId=max(id) from btGRLog 
update btGRLog
set fEnd = GETDATE(),
fStep = @step
where id = @maxId 


GO
USE [Cribmaster]
GO


create procedure [dbo].[bpGRReceiverCount]
@receiverCount int output
AS
BEGIN
	SET NOCOUNT ON
	Declare @lastRun datetime
	select @lastRun=flastrun from btgrvars
	--select * from  btGRTrans
	-- select distinct po/date(s) with only one received time for each po/date combo
	select @receiverCount=count(*)
	from
	(
		select VendorPONumber,start
		from 
		(
			-- select only the records not transfered yet
			select VendorPONumber, VendorNumber, id,podetailid, DATEADD(DD, DATEDIFF(DD, 0, received), 0) start, received
			from PODETAIL pod
			left outer join
			btGRTrans grt
			on pod.id = grt.podetailId
			where Received > @lastRun
			and grt.podetailId is null
		) pod2
		group by VendorPONumber,start 
	)lv1

RETURN
END

USE [Cribmaster]
GO


CREATE TABLE [dbo].[btGRVars](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[VerCol] [timestamp] NOT NULL,
	[fLastRun] [datetime] NOT NULL
) ON [PRIMARY]

GO

USE [m2mdata01]
GO

--//////////////////////////////////////////////
-- user sends in the number of receivers to be generated
-- sproc returns the starting receiver number and updates
-- sysequ with the new current receiver number
--//////////////////////////////////////////////
create procedure [dbo].[bpGRSetCurrentReceiver]
@receiverCount as int,
@currentReceiver as char(6) OUTPUT
as
begin
--declare @currentReceiver char(6)
--declare @receiverCount int
--set @receiverCount = 1
declare @nextReceiver int

SELECT @currentReceiver=Cast(RTRIM(FCNUMBER) as char(6)) FROM SYSEQU WHERE fcclass = 'RCMAST.FRECEIVER'
set @nextReceiver=cast(@currentReceiver as int) +@receiverCount
--select @currentReceiver,@nextReceiver
update Sysequ
set fcnumber = cast(@nextReceiver as char(25))
WHERE fcclass = 'RCMAST.FRECEIVER'

--SELECT FCNUMBER FROM btSYSEQU WHERE fcclass = 'RCMAST.FRECEIVER'
end

GO

USE [Cribmaster]
GO


/*
bpGRGenReceivers
Calls bpGRGenRCMast and bpGRGenRCItem to create all Made2Manage records receiver records needed
since the last run of the Generate Receivers program
*/
create procedure [dbo].[bpGRGenReceivers] 
	@currentReceiver as char(6)
AS
exec bpGRLogStepSet 'STEP_10_GEN_RECEIVERS'
exec bpGRGenRCMast @currentReceiver
exec bpGRGenRCItem 


USE [Cribmaster]
GO

/*
bpGRLogStepSet
Sets the current step of this run of the Generate Receivers process
*/
create procedure [dbo].[bpGRLogStepSet] 
	@step as varchar(50)
AS

Declare @maxId integer
select @maxId=max(id) from btGRLog 
update btGRLog
set fStep = @step
where id = @maxId 

GO


USE [Cribmaster]
GO


/*
bpGRGenRCMast
Generate one rcmast record for each vendorpo/date 
pair where items have been received since this sproc was last ran
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
	,@currentReceiver -1 + row_number() over (order by VendorPONumber,start) as freceiver
	,UDFM2MVENDORNUMBER fvendno
	,'NS' faccptby
	,'' fbilllad
	, fcompany
	,'UPS-OURS' ffrtcarr
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
				--Declare @lastRun datetime
				--select @lastRun=flastrun from btgrvars
				-- select only the records not transfered yet
				select VendorPONumber, VendorNumber, id,DATEADD(DD, DATEDIFF(DD, 0, received), 0) start, received
				from PODETAIL pod
				where Received > @lastRun
				--33
				and pod.id not in
				(
					select podetailId from btGRTrans
				)
				--33
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
	order by VendorPONumber asc,start asc

select LEFT(convert(varchar, start, 107),10) rcvdate,
* 
from 
btrcmast
order by fpono,start


GO


USE [Cribmaster]
GO


/*
bpGRGenRCItem
Generate a rcitem record for each podetail received since the last run of the generate receiver program.
Link each record to the rcmast record with the same fpono and start fields.  There will be at most one
rcmast record with fpono/start field combination generated in a single run of the program.  Although
it is possible for another rcmast record with the same fpono/start fields to have been created in 
previous runs.  This would require Nancy to have received items for a fpono, generating receivers, and 
then receiving items and running the program again later in the day.
	on rcm.fpono=pod.VendorPONumber
	and rcm.start=pod.start
-- fmeasure - will be set to EA.  We could change bpPORT sproc to ask Nancy what unit of measure
-- she want's for each poitem created and make the process more complicated by creating the records
-- in m2m without an fmeasure field and link m2m.btrcitem to m2m.poitem and retrieve the unit of 
-- measure Nancy selected when the poitem was created.
-- select distinct fmeasure from poitem order by fmeasure
-- add to ssis create btMeasure

*/
create procedure [dbo].[bpGRGenRCItem] 
AS
SET NOCOUNT ON
Declare @lastRun datetime
select @lastRun=flastrun from btgrvars

INSERT INTO [dbo].[btrcitem]
           ([fitemno]
           ,[fpartno]
           ,[fpartrev]
           ,[finvcost]
           ,[fcategory]
           ,[fcstatus]
           ,[fiqtyinv]
           ,[fjokey]
           ,[fsokey]
           ,[fsoitem]
           ,[fsorelsno]
           ,[fvqtyrecv]
           ,[fqtyrecv]
           ,[freceiver]
           ,[frelsno]
           ,[fvendno]
           ,[fbinno]
           ,[fexpdate]
           ,[finspect]
           ,[finvqty]
           ,[flocation]
           ,[flot]
           ,[fmeasure]
           ,[fpoitemno]
           ,[fretcredit]
           ,[ftype]
           ,[fumvori]
           ,[fqtyinsp]
           ,[fauthorize]
           ,[fucost]
           ,[fllotreqd]
           ,[flexpreqd]
           ,[fctojoblot]
           ,[fdiscount]
           ,[fueurocost]
           ,[futxncost]
           ,[fucostonly]
           ,[futxncston]
           ,[fueurcston]
           ,[flconvovrd]
           ,[fcomments]
           ,[fdescript]
           ,[fac]
           ,[sfac]
           ,[FCORIGUM]
           ,[fcudrev]
           ,[FNORIGQTY]
           ,[Iso]
           ,[Ship_Link]
           ,[ShsrceLink]
           ,[fCINSTRUCT])
		   --------START HERE
--Declare @lastRun datetime
--select @lastRun=flastrun from btgrvars
--		Declare @lastRun datetime
--		set @lastRun = '2016-10-25'

select 
---start debug
--lv1.fpono,lv2.fpoitemno, lv1.freceiver,
---end debug
case 
when (row_number() over (PARTITION BY freceiver order by lv2.fpoitemno )) > 99 then cast((row_number() over (PARTITION BY freceiver order by lv2.fpoitemno )) as char(3))
when (row_number() over (PARTITION BY freceiver order by lv2.fpoitemno )) > 9 then '0' + cast((row_number() over (PARTITION BY freceiver order by lv2.fpoitemno )) as char(3))
else '00' + cast((row_number() over (PARTITION BY freceiver order by lv2.fpoitemno )) as char(3))
end	as fitemno,
-- start debug
--lv1.start,lv1.Received,
-- end debug
left(lv1.ItemDescription,25) fpartno,'NS' fpartrev,0.0 finvcost,
fcategory,'' fcstatus,0.0 fiqtyinv,'' fjokey,'' fsokey,'' fsoitem,'' fsorelsno,
podQuantity fvqtyrecv,podQuantity fqtyrecv, lv1.freceiver,'0' frelsno,fvendno,'' fbinno,
'1900-01-01 00:00:00.000' fexpdate,'' finspect,0.0 finvqty,'' flocation,'' flot,'EA' fmeasure,
lv2.fpoitemno,'' fretcredit,'P' ftype,'I' fumvori,0.0 fqtyinsp,'' fauthorize, lv1.cost fucost,
0 fllotreqd,0 flexpreqd,'' fctojoblot,0.0 fdiscount,0.0 fueurocost,0.0 futxncost, 
lv1.Cost fucostonly,0.0 futxncston,0.0 fueurcston,0 flconvovrd,'' fcomments, 
case
when lv1.fdescript is null then ''
else fdescript
end as fdescript,
'Default' fac,'Default' sfac,'' FCORIGUM,'' fcudrev,0.0 FNORIGQTY,'' Iso,0 Ship_Link,
0 ShsrceLink,'' fCINSTRUCT
from
(

	-- Declare @lastRun datetime
	-- select @lastRun=flastrun from btgrvars
	-- we now have the receiver number for all items

	select rcm.fpono,rcm.freceiver,
	rcm.start,pod.Received,pod.ItemDescription,pod.fcategory,pod.Quantity podQuantity,
	pod.fvendno,pod.Cost,fdescript
	from(

	select fpono,start,freceiver from btrcmast 
	--423
	--order by fpono,start
	)rcm
	inner join 
	(

		--Declare @lastRun datetime
		--set @lastRun = '2016-10-25'
		--select @lastRun=flastrun from btgrvars

		-- select only the records not transfered yet
		-- multiple records with the same itemdescription is possible only not with the same received time.
		-- If an item was received at 10am another item could be received at 4pm with the same itemdescription and po.
		-- in this case there could be 2 rcmast records for the same itemdescription and the same vendorponumber,start id.
		select maxid,VendorPONumber,start, itemdescription,fdescript,Quantity,Cost,
		pod.VendorNumber, fvendno, received,UDF_POCATEGORY fcategory,comments
		from
		(
			select vendorponumber,DATEADD(DD, DATEDIFF(DD, 0, received), 0) start,ItemDescription,sum(quantity) Quantity,comments,
			description2 fdescript,max(received) received,UDF_POCATEGORY,Cost,VendorNumber,max(id) maxId
			from 
			( 
--		select @lastRun=flastrun from btgrvars
				select vendorponumber,received,ItemDescription,Quantity,comments,description2,UDF_POCATEGORY,Cost,VendorNumber,
				id from PODETAIL pod
				where Received > @lastRun
		 		and pod.id not in
				(
					select podetailId from btGRTrans
				)
--				order by vendorponumber,itemdescription
				--643
--		and VendorPONumber = '121124',63210
			) pod
			group by vendorponumber,DATEADD(DD, DATEDIFF(DD, 0, received), 0),ItemDescription,comments,Description2,UDF_POCATEGORY,cost,VendorNumber
--			order by vendorponumber,itemdescription
			--having VendorPONumber = '121124'
		)pod
		inner join 	(
			select VendorNumber,UDFM2MVENDORNUMBER fvendno from vendor 
		)vn1
		on pod.VendorNumber = vn1.VendorNumber
		--37
		--642
--		and VendorPONumber = '121124',63210
--		order by VendorPONumber,start,ItemDescription
		--170
	) pod
	on rcm.fpono=pod.VendorPONumber
	and rcm.start=pod.start
	--order by VendorPONumber,start,ItemDescription
	--170
	--More because podetail can have multiple records with the same itemdescription because of partial shipments
)lv1
inner join
(
	-- get the fitemnumber we assigned to each item when creating the m2m poitem records
	-- for all the po(s) that have any items received since the last run of the gen rcv program
	-- we need retrieve all the podetail records and partion them to determine the fpoitem number
	-- generated from the bpPORT sproc.
--	Declare @lastRun datetime
--	select @lastRun=flastrun from btgrvars
--		Declare @lastRun datetime
--		set @lastRun = '2016-10-25'

	select lv1.VendorPONumber fpono, lv2.*
	from
	(
		select distinct vendorponumber from	PODETAIL pod
		where Received > @lastRun
		and pod.id not in
		(
			select podetailId from btGRTrans
		)
		--320
	)lv1
	inner join
	(
		-- Declare @lastRun datetime
		-- select @lastRun=flastrun from btgrvars
		select VendorPONumber,
			case 
			when (row_number() over (PARTITION BY PONumber order by ItemDescription )) > 99 then cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
			when (row_number() over (PARTITION BY PONumber order by ItemDescription )) > 9 then ' ' + cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
			else '  ' + cast((row_number() over (PARTITION BY PONumber order by ItemDescription )) as char(3))
			end	as fpoitemno,
			ItemDescription 
		from 
		(
			-- there will be multiple podetail records with the same itemdescription when a partial shipment is received
			-- but when the poitem record was created in m2m only 1 record with the itemdescription was made
			-- we need to retrieve all of the podetail records for a po so we can accurately assign the same fpoitemno 
			-- that we did when bpPORT sproc created the poitem entries.
			select distinct ponumber,vendorponumber,itemdescription from PODETAIL
		)pod
	) lv2
	on 
	lv1.VendorPONumber=lv2.VendorPONumber
	--694
	--235
	--order by lv2.VendorPONumber,lv2.fpoitemno
	--665
	--665
)lv2
on 
lv1.fpono=lv2.fpono and
lv1.ItemDescription=lv2.ItemDescription
order by lv1.fpono,lv1.start,lv2.fpoitemno
--642 one for each distinct fpono,start,itemdescription 

select * 
from 
btrcitem
order by freceiver,fitemno

GO

USE [m2mdata01]
GO


--/////////////////////////////////////////////////////////////////////
-- Insert the receiver(s) generated by Cribmaster
--/////////////////////////////////////////////////////////////////////
create procedure [dbo].[bpGRRCMastInsert] 
@fclandcost as char(1),
@frmano as char(25),
@fporev as char(2),
@fcstatus as char(1),
@fdaterecv as datetime,
@fpono as char(6),
@freceiver as char(6),
@fvendno as char(6),
@faccptby as char(3),
@fbilllad as char(18),
@fcompany as varchar(35),
@ffrtcarr as char(20),
@fpacklist as char(15),
@fretship as char(1),
@fshipwgt as numeric(11, 2),
@ftype as char(1),
@start as datetime,
@fprinted as bit,
@flothrupd as bit,
@fccurid as char(3),
@fcfactor as M2MMoney,
@fdcurdate as datetime,
@fdeurodate as datetime,
@feurofctr as M2MMoney,
@flpremcv as bit,
@docstatus as char(10),
@frmacreator as varchar(25)
AS
BEGIN
insert into rcmast
(
fclandcost,frmano,fporev,fcstatus,fdaterecv,fpono,freceiver,fvendno,faccptby,
fbilllad,fcompany,ffrtcarr,fpacklist,fretship,fshipwgt,ftype,start,fprinted,
flothrupd,fccurid,fcfactor,fdcurdate,fdeurodate,feurofctr,flpremcv,docstatus,frmacreator
)
values
(
@fclandcost,@frmano,@fporev,@fcstatus,@fdaterecv,@fpono,@freceiver,@fvendno,@faccptby,
@fbilllad,@fcompany,@ffrtcarr,@fpacklist,@fretship,@fshipwgt,@ftype,@start,@fprinted,
@flothrupd,@fccurid,@fcfactor,@fdcurdate,@fdeurodate,@feurofctr,@flpremcv,@docstatus,
@frmacreator
)
END
GO

USE [m2mdata01]
GO

--//////////////////////////////////////////////////////////
-- Update status of all PO(s) within a given range to be
-- open or closed depending on whether or not all poitem(s) 
-- have been completely received
--////////////////////////////////////////////
create procedure [dbo].[bpGRPOStatusUpdate]
@rcvStart as char(6), 
@rcvEnd as char(6) 
as
exec bpGRPOStatusClose @rcvStart,@rcvEnd
exec bpGRPOStatusOpen @rcvStart,@rcvEnd
exec bpGRPOItemQtyRecv @rcvStart, @rcvEnd
GO

--//////////////////////////////////////////////////////////
-- Update poitem's quantity received field
-- based upon all receiver items
--////////////////////////////////////////////
create procedure [dbo].[bpGRPOItemQtyRecv]
@rcvStart as char(6), 
@rcvEnd as char(6) 
as
UPDATE Table_A
SET Table_A.frcpqty = Table_B.fqtyrecvSum
--22 records were updated as expected
--use m2mdata02
--Declare @rcvStart as char(6) 
--Declare @rcvEnd as char(6) 
--set @rcvStart = '288636'
--set @rcvEnd = '288655'
--select Table_A.fpono,Table_A.fpartno,Table_A.fordqty ,Table_A.frcpqty,Table_B.fqtyrecvSum 
from poitem AS Table_A
INNER JOIN 
(
--use m2mdata02
--Declare @rcvStart as char(6) 
--Declare @rcvEnd as char(6) 
--set @rcvStart = '288636'
--set @rcvEnd = '288655'
	--22
	select fpono,fpartno,count(*) poitemCnt, sum(fqtyrecv) fqtyrecvSum
	from
	(

		/* start production */
		-- all the receivers for the fpono(s) we have received no matter the receiver number
		select rcm.fpono,rci.fpoitemno, rcm.freceiver,rci.fitemno rcvItemno,rci.fpartno,rci.fqtyrecv
		from 
		rcmast rcm
		inner join
		rcitem rci
		on rcm.freceiver=rci.freceiver
		where rcm.fpono in 
		(

			-- all the fpono we have received 
			select distinct fpono from rcmast 
			where freceiver >= @rcvStart and freceiver <= @rcvEnd
			--order by fpono
			--14
		)
		--23
	)api
	group by fpono,fpartno
) AS Table_B
ON Table_A.fpono = Table_B.fpono
and Table_A.fpartno = Table_B.fpartno

USE [M2MDATA02]
GO


--//////////////////////////////////////////////////////////
-- Close all PO(s) within a given range if all poitem(s) 
-- have been completely received
--////////////////////////////////////////////
create procedure [dbo].[bpGRPOStatusClose]
@rcvStart as char(6), 
@rcvEnd as char(6) 
as
update pomast
set 
foldstatus = 'OPEN',
fstatus = 'CLOSED',
fchangeby = 'Ashley',
freasoncng ='Automatic closure.',
fcngdate = convert(varchar(10), getdate(),120)
WHERE fpono
in 
(
	select fpono
	from
	(
		select fpono,fItemno,fpartno,fordqty,fqtyrecvSum,
		case
			when fordqty <> fqtyrecvSum then 1
			else 0
		end notComplete
		from
		(
			select poi.fpono,poi.fitemno,poi.fpartno,poi.fordqty,
			case
				when recv.fqtyrecvSum is null then 0.0
				else recv.fqtyrecvSum
			end fqtyrecvSum
			from
			(

				-- get all the fpono(s) that we created receivers for
				-- and all their associated items and order quantities
				select rcm.fpono,poi.fitemno,poi.fpartno,poi.fordqty
				from
				(
					/* start production */
					select distinct fpono from rcmast 
					where freceiver >= @rcvStart and freceiver <= @rcvEnd
					--14
				)rcm
				inner join
				poitem poi
				on rcm.fpono=poi.fpono
				--order by rcm.fpono,poi.fitemno
				-- 34
			) poi
			left outer join
			(

				-- all items received for poitem 
				select fpono,fpartno,count(*) poitemCnt, sum(fqtyrecv) fqtyrecvSum
				from
				(

					/* start production */
					-- all the receivers for the fpono(s) we have received no matter the receiver number
					select rcm.fpono,rci.fpoitemno, rcm.freceiver,rci.fitemno rcvItemno,rci.fpartno,rci.fqtyrecv
					from 
					rcmast rcm
					inner join
					rcitem rci
					on rcm.freceiver=rci.freceiver
					where rcm.fpono in 
					(

						-- all the fpono we have received 
						select distinct fpono from rcmast 
						where freceiver >= @rcvStart and freceiver <= @rcvEnd
						--order by fpono
						--14
					)
					--23
				)api
				group by fpono,fpartno
				--23
				--order by fpono,fpoitemno
			) recv
			on
			poi.fpono=recv.fpono and
			poi.fpartno=recv.fpartno
--			poi.fitemno=recv.fpoitemno
		--	order by poi.fpono,poi.fitemno
			--34
		) ncmp
		--order by fpono,fitemno
	) mxc
	group by fpono
	having max(notComplete) = 0
--	order by fpono
)

GO


--//////////////////////////////////////////////////////////
-- Open all PO(s) within a given range if all poitem(s) 
-- have NOT been completely received
--////////////////////////////////////////////
create procedure [dbo].[bpGRPOStatusOpen]
@rcvStart as char(6), 
@rcvEnd as char(6) 
as
update pomast
set 
foldstatus = 'STARTED',
fstatus = 'OPEN',
fchangeby = 'Ashley',
freasoncng ='Automatic closure.',
fcngdate = convert(varchar(10), getdate(),120)
WHERE fpono
in 
(
	select fpono
	from
	(
		select fpono,fItemno,fpartno,fordqty,fqtyrecvSum,
		case
			-- have received all items check
			when  fqtyrecvSum >= fordqty then 1
			else 0
		end complete
		from
		(
			select poi.fpono,poi.fitemno,poi.fpartno,poi.fordqty,
			case
				when recv.fqtyrecvSum is null then 0.0
				else recv.fqtyrecvSum
			end fqtyrecvSum
			from
			(
				-- get all the fpono(s) that we created receivers for
				-- and all their associated items and order quantities
				select rcm.fpono,poi.fitemno,poi.fpartno,poi.fordqty
				from
				(
					/* start production */
					select distinct fpono from rcmast 
					where freceiver >= @rcvStart and freceiver <= @rcvEnd
					--28
				)rcm
				inner join
				poitem poi
				on rcm.fpono=poi.fpono
				--order by rcm.fpono,poi.fitemno
				-- 66
			) poi
			left outer join
			(

				-- all items received for poitem 
				select fpono,fpartno,count(*) poitemCnt, sum(fqtyrecv) fqtyrecvSum
				from
				(

					/* start production */
					-- all the receivers for the fpono(s) we have received no matter the receiver number
					select rcm.fpono,rci.fpoitemno, rcm.freceiver,rci.fitemno rcvItemno,rci.fpartno,rci.fqtyrecv
					from 
					rcmast rcm
					inner join
					rcitem rci
					on rcm.freceiver=rci.freceiver
					where rcm.fpono in 
					(
						-- all the fpono we have received since the last ASHLEY run
						select distinct fpono from rcmast 
						where freceiver >= @rcvStart and freceiver <= @rcvEnd
					)
					--order by fpono,fpoitemno
				)api
				group by fpono,fpartno
				--order by fpono,fpoitemno
				--23
			) recv
			on
			poi.fpono=recv.fpono and
			poi.fpartno=recv.fpartno
			--order by poi.fpono,poi.fitemno
			--66

		) ncmp
		--order by fpono,fitemno

	) mxc
	group by fpono
	having min(complete) = 0
	--order by fpono
)



/*  use to copy pos from one database to another */
create procedure [dbo].[bpDupPO] 
	@currentPO as char(6)
AS
BEGIN
SET NOCOUNT ON
insert into [m2mdata02].dbo.pomast
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
select fpono,fcompany,fcshipto, forddate,fstatus,fvendno,fbuyer,
fchangeby,fshipvia, fcngdate, fcreate, ffob, fmethod, foldstatus, fordrevdt, 
fordtot,fpayterm,fpaytype,fporev,fprint,freqdate,freqsdt,freqsno, frevtot, 
fsalestax, ftax, fcsnaddrke, fnnextitem, fautoclose,fnusrqty1,fnusrcur1, fdusrdate1,fcfactor,
fdcurdate, fdeurodate, feurofctr, fctype, fmsnstreet, fpoclosing,fndbrmod, 
fcsncity, fcsnstate, fcsnzip, fcsncountr, fcsnphone,fcsnfax,fcshcompan,fcshcity,
fcshstate,fcshzip,fcshcountr,fcshphone,fcshfax,fmshstreet,
flpdate,fconfirm,fcontact,fcfname,fcshkey,fcshaddrke,fcusrchr1,fcusrchr2,fcusrchr3,
fccurid,fmpaytype,fmusrmemo1,freasoncng
from [m2mdata01].dbo.pomast
where fpono in 
(
select fpono from [m2mdata02].dbo.rcmast
where freceiver >= '288526'
and freceiver <= '288538'
)


/*  use to copy pos from one database to another */
insert into [m2mdata02].dbo.poitem
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
SELECT 
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
from [m2mdata01].dbo.poitem
where fpono in 
(
select fpono from [m2mdata02].dbo.rcmast
where freceiver >= '288525'
and freceiver <= '288538'
)



USE [Cribmaster]
GO



--///////////////////////////////////////////////////////////////////
--Add all podetail ids to btGRTrans that were used to make up the receiver given
--///////////////////////////////////////////////////////////////////
create proc [dbo].[bpGRTransInsert]
@freceiver as char(6),
@sessionId as int 
as
	-- could have dup fpono,start,itemdescription records if item was received more 
	-- than once in a single day. such as 121124 --63163,63210,4C12H-1.2340 on 10/26
	-- only one rcitem record will be generated for ids 63163 and 63210 but both 
	-- podetail ids must be added to the btGRTransfered table.
--	select pod.VendorPONumber,pod.start,pod.fpartno,id,freceiver
--	Declare @freceiver char(6) 
--	set @freceiver = '285893'
--	Declare @sessionId int 
--	set @sessionId = 5
	insert into btGRTrans (podetailId,freceiver,sessionId)
	select id as podetailId,freceiver, @sessionId as sessionId
	from
	(
		-- select only podetails that have not been inserted previously.  If unlikely it is possible
		-- that a po,date,partno record could have been received and Ashley run previously in the day.
		-- which would have resulted in a podetail record of the same po,date, and partno already having
		-- been inserted into the transaction log.  If a po, partno was received at 7am and the receiver
		-- process was run at 10am for po,date,
		-- partno and podetail id x was inserted into the transaction log, 
		-- and it was ran again and 5pm and the
		-- same po,partno was received again at 12pm then the podetail item received at  7am will 
		-- not be included for the receiver generated in the 5pm run.
		select VendorPONumber,
		DATEADD(DD, DATEDIFF(DD, 0, received), 0) start,left(ItemDescription,25) fpartno,received,id
		from PODETAIL pod
		where pod.id not in
		(
			select podetailId from btGRTrans
		)

--		where VendorPONumber='121124'
	) pod
	inner join -- user does not have to generate a rcitem record for each podetail
	-- only add records to btGRTransfered that have a corresponding btrcitem record
	(


		select rcm.fpono,DATEADD(DD, DATEDIFF(DD, 0, rcm.fdaterecv),0) start,rci.fpartno,rci.freceiver from
		btrcmast rcm
		inner join
		btrcitem rci
		on rcm.freceiver=rci.freceiver
		--where rcm.fpono='121124'
	) rci
	 on pod.vendorponumber=rci.fpono
	 and pod.start=rci.start
	 and pod.fpartno=rci.fpartno
	 where freceiver = @freceiver
--	 where pod.Received > @lastRun and rci.fpono='121124'
--	 order by VendorPONumber,rci.start,rci.fpartno


GO


USE [Cribmaster]
GO
--/////////////////////////////////////////////////////////////////////////////////
--Delete all podetail ids to btGRTrans that were used to make up the receiver given
--/////////////////////////////////////////////////////////////////////////////////
create proc [dbo].[bpGRTransDelete]
@sessionId as int 
as
delete from btGRTrans where sessionId=@sessionId

GO

NOT TESTED
NEXT STEPs 
// Add remove checkbox to rcmast package list table
// and to SQL query that generates rcmast records in cribmaster.

-BEFORE INSERTING RCMAST,RCITEM RECORDS INTO M2M
LOOP THROUGH RCMAST RECORDS AND CALL bpGRTransInsException for
each record marked for removal.
// put this call at the top of the m2m insert process.

-WHEN INSERTING RCMAST,RCITEM RECORDS INTO M2M SKIP RECORDS
FLAGGED AS REMOVE.

USE [Cribmaster]
GO
--//////////////////////////////////////////////////////////////////
-- Remove PODETAIL ID from consideration by the Ashley Gen Receiver
-- program by inserting it into btGRTrans table
-- For whatever reason the MRO personnel has chosen not to generate
-- a receiver for this PODetail ID. 
-- Since we do not pass a session ID. These items will not be deleted
-- if a rollback of the session happens. 
--///////////////////////////////////////////////////////////////////
create procedure [dbo].[bpGRTransInsException]
@VendorPONumber as varchar(16),
@start as datetime
as
begin
Declare @lastRun datetime
select @lastRun=flastrun from btgrvars
--Declare @VendorPONumber varchar(16)
--set @VendorPONumber = '122272'
--Declare @start datetime
--'1900-01-01 00:00:00.000'
--set @start = '2017-01-20 00:00:00:000'

INSERT INTO [dbo].[btGRTrans]
           ([podetailId]
           ,[freceiver]
           ,[sessionId])
-- select only the records not transfered yet
--select VendorPONumber, VendorNumber, id,DATEADD(DD, DATEDIFF(DD, 0, received), 0) start, received
select id podetailid, '999999' freceiver,999 sessionId
from PODETAIL pod
where Received > @lastRun
and VendorPONumber = @VendorPONumber
and DATEADD(DD, DATEDIFF(DD, 0, received), 0) = @start
--33
and pod.id not in
(
	select podetailId from btGRTrans
)
end

--EXCEPTION PROCESSING 
-- for when item received in Cribmaster that was not actually received and should not be paid
-- insert item into btGRTrans log 
USE [Cribmaster]
GO

select po.ponumber,pod.id,pod.Quantity,pod.ItemDescription from po 
inner join PODETAIL pod
on
po.ponumber=pod.ponumber
where po.VendorPO = '121304'

26394	id=63262	4	T100-KM102DA-M5 D210M5  6HX

select * from btGRTrans


INSERT INTO [dbo].[btGRTrans]
           ([podetailId]
           ,[freceiver]
           ,[sessionId])
     VALUES
           (63262
           ,'999999'
           ,999)