

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
@po int
AS
BEGIN
--Declare @po int
--set @po = 26542
SET NOCOUNT ON
--select * from btapvend
--select VendorName,PurchaseAddress1,PurchaseCity,PurchaseState,PurchaseZip from vendor
select 1 page,0 selected,0 visible,ord.poDate,ord.poNumber,
case
 when ven.VendorName is null then 'None'
 else ven.VendorName
end vendorName,
apv.fvendno,
apv.fcterms,
apv.fccompany,
apv.fmstreet,
apv.fccity,
apv.fcstate,
apv.fczip,
apv.fccountry,
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
ord.qtyOrd*ord.cost extCost,
case
 when rcv.qtyReceived is null then 0
 else rcv.qtyReceived
end qtyReceived,
received
from
(
	select po.podate,po.ponumber,po.Vendor,pod.item,
	sum(pod.Quantity) qtyOrd,max(pod.ItemDescription) ItemDescription,
	max(pod.Cost) cost
	from po
	inner join PODETAIL pod
	on po.ponumber=pod.PONumber
	group by po.PODate,po.ponumber,po.Vendor,po.SiteId,po.poStatusNo,po.BlanketPO,pod.item
	having po.PONumber = @po
	--order by po.PONumber,pod.item
	--31
)ord
left outer join
--qtyReceived
(
	select ponumber,item,sum(Quantity) qtyReceived,max(Received) Received
	from
	(
		select  po.PODate,po.ponumber,po.SiteId,po.poStatusNo,po.BlanketPO,pod.item,Quantity,pod.Received
		from po
		inner join PODETAIL pod
		on po.ponumber=pod.PONumber
		where po.PONumber = @po
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
order by PONumber,item
end
