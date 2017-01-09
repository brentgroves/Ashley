create procedure [dbo].[bpGROpenPO] 
AS
BEGIN
SET NOCOUNT ON
select poNumber
from po
where ((po.POSTATUSNO = 0) or (po.POSTATUSNO = 2)) and po.SITEID <> '90' 
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
