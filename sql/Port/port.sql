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

USE [m2mdata01]
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
		delete from pomast
		where fpono >=@postart and fpono <=@poend 
		delete from poitem
		where fpono >=@postart and fpono <=@poend
	END
end

GO

