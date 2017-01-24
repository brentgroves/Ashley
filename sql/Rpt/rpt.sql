

create procedure bpGRNoReceivers
@dtStart varchar(20),
@dtEnd varchar(20)
as
begin
SET NOCOUNT ON
--Declare @dtStart varchar(20)
--Declare @dtEnd varchar(20)
--set @dtStart = '06-01-2016 10:15:10'
--set @dtEnd =  '12-05-2016 10:15:10'
Declare @dateStart datetime
Declare @dateEnd datetime
set @dateStart = CONVERT(datetime, @dtStart)
set @dateEnd = CONVERT(datetime, @dtEnd)
select po.VendorPO,pos.POStatusDescription,ven.VendorName,po.podate,pod.itemdescription,pod.Description2, pod.cribbin,quantity,pod.Received
from po 
inner join PODETAIL pod
on po.PONumber = pod.PONumber
inner join VENDOR ven
on po.Vendor=ven.VendorNumber
inner join postatus pos
on po.POStatusNo=pos.POStatusNo
where podate >= @dateStart
and podate <= @dateEnd
and received is null
and pos.POStatusNo=3 or pos.POStatusNo=0
and po.SITEID <> '90'
and (po.BLANKETPO = '' or po.BLANKETPO is null)
order by pos.POStatusDescription desc, pod.PONumber desc, pod.ItemDescription

end

create procedure [dbo].[bpGROpenPO] 
AS
BEGIN
SET NOCOUNT ON
select poNumber
from po
where ((po.POSTATUSNO = 0) or (po.POSTATUSNO = 2)) and po.SITEID <> '90' 
and (po.BLANKETPO = '' or po.BLANKETPO is null)
and po.PODate >= '2016-10-01'
order by PONumber desc
end


create procedure [dbo].[bpGROpenPOVendorEmailReport] 
@po varchar(12)
AS
BEGIN
SET NOCOUNT ON
--Declare @po varchar(12)
--set @po = '121556'
--select * from btapvend
--select ROW_NUMBER() ,VendorName,PurchaseAddress1,PurchaseCity,PurchaseState,PurchaseZip from vendor
select ROW_NUMBER() OVER(ORDER BY ord.PONumber,ord.item ) rowNumber,1 page,0 selected,0 visible,ord.poDate,ord.poNumber,
case
 when ven.VendorName is null then 'None'
 else ven.VendorName
end vendorName,
apv.fvendno,
apv.fcterms,
case
 when trm.description is null then 'None'
 else trm.description
end termsDesc,
apv.fccompany,
apv.fmstreet,
apv.fccity,
apv.fcstate,
apv.fczip,
apv.fccountry,
apv.fcphone,
apv.fcfax,
'UPS-OURS' fshipvia,
'OUR PLANT' ffob,
'NS' planner,
case
 when ven.EMailAddress is null then 'None'
 else ven.EMailAddress
end eMailAddress,
ord.item,
case
 when ord.ItemDescription is null then 'None'
 else ord.ItemDescription
end itemDescription,
ord.qtyOrd,
CAST(ord.cost AS DECIMAL(18,2)) cost,
CAST(ord.qtyOrd*ord.cost AS DECIMAL(18,2)) extCost,
case
 when rcv.qtyReceived is null then 0
 else rcv.qtyReceived
end qtyReceived,
received,
case
 when ord.pocategory is null then 'None'
 else ord.pocategory 
end pocategory
from
(
	select po.podate,po.VendorPO ponumber,po.Vendor,pod.item,
	sum(pod.Quantity) qtyOrd,max(pod.ItemDescription) ItemDescription,
	max(pod.Cost) cost,max(poc.UDF_POCATEGORYDescription) pocategory
	from po
	inner join PODETAIL pod
	on po.ponumber=pod.PONumber
	left outer join UDT_POCATEGORY poc
	on pod.UDF_POCATEGORY= poc.udf_pocategory
	group by po.PODate,po.ponumber,po.VendorPO, po.Vendor,po.SiteId,po.poStatusNo,po.BlanketPO,pod.item
	having po.VendorPO = @po
	--order by po.PONumber,pod.item
	--31
)ord
left outer join
--qtyReceived
(
	select ponumber,item,sum(Quantity) qtyReceived,max(Received) Received
	from
	(
		select  po.PODate,po.VendorPO ponumber,po.SiteId,po.poStatusNo,po.BlanketPO,pod.item,Quantity,pod.Received
		from po
		inner join PODETAIL pod
		on po.ponumber=pod.PONumber
		where po.VendorPO = @po
		and (pod.Received is not null) 
		--15
	)lv1
	group by ponumber,item
	--order by PONumber,item
	--14
)rcv
on ord.PONumber=rcv.PONumber
and ord.item=rcv.item
inner join vendor ven
on ord.Vendor=ven.VendorNumber
inner join btapvend apv
on ven.UDFM2MVENDORNUMBER=apv.fvendno
inner join btterms trm
on apv.fcterms = trm.fcterms
order by PONumber,item
end



--//////////////////////////////////////////////////////////
-- For Ashley PO Status Report 
--////////////////////////////////////////////
create procedure [dbo].[bpGRPOStatusRpt]
@dtStart varchar(20),
@dtEnd varchar(20)
AS
BEGIN
--Declare @dtStart varchar(20)
--Declare @dtEnd varchar(20)
Declare @startDateParam datetime
Declare @endDateParam datetime
--set @dtStart = 'Jan 01 2017 00:00:00'
--set @dtEnd = 'Jan 12 2017 00:00:00'
set @startDateParam = convert(datetime, @dtStart, 101)
set @endDateParam = convert(datetime, @dtEnd, 101)

select ncmp.fpono,pom.fcompany,pom.fcngdate,ncmp.fItemno,
RTRIM(LTRIM(pom.fstatus)) fstatus,ncmp.fpartno,ncmp.fordqty,ncmp.fqtyrecvSum,
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
		select dst.fpono,poi.fitemno,poi.fpartno,poi.fordqty
		from
		(
			select distinct pom.fpono 
			from rcmast rcm
			inner join pomast pom
			on rcm.fpono=pom.fpono
			where pom.fbuyer ='CM'
			and fdaterecv >= @startDateParam
			and fdaterecv <= @endDateParam
		)dst
		inner join poitem poi
		on dst.fpono=poi.fpono
		--order by rcm.fpono,poi.fitemno
		-- 180
	) poi
	left outer join
	(
		-- all items received for poitem 
		select fpono,fpoitemno,count(*) poitemCnt, sum(fqtyrecv) fqtyrecvSum
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
				select distinct pom.fpono 
				from rcmast rcm
				inner join pomast pom
				on rcm.fpono=pom.fpono
				where pom.fbuyer ='CM'
				and fdaterecv >= @startDateParam
				and fdaterecv <= @endDateParam
				--88
			)
			--185
		)api
		group by fpono,fpoitemno
		--order by fpono,fpoitemno
		--169
	) recv
	on
	poi.fpono=recv.fpono and
	poi.fitemno=recv.fpoitemno
	--order by poi.fpono,poi.fitemno
	--180
) ncmp
inner join pomast pom
on ncmp.fpono=pom.fpono
--inner join vendor ven
--on 
order by ncmp.fpono,ncmp.fitemno
end

GO