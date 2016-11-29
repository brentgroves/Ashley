'**********************************************************************
'  Visual Basic ActiveX Script
'************************************************************************

Function Main()
'**********************************************************************
'  Visual Basic ActiveX Script
'************************************************************************


' These values were copied from the ADOVBS.INC file.
'---- CursorTypeEnum Values ----
Const adOpenForwardOnly = 0
Const adOpenKeyset = 1
Const adOpenDynamic = 2
Const adOpenStatic = 3

'---- CommandTypeEnum Values ----
Const adCmdUnknown = &H8
Const adCmdText = &H1
Const adCmdTable = &H2
Const adCmdStoredProc = &H4


    Dim SourceConn
    Dim SourceRecordset
    Dim SourceRecordset2
    
    Dim DestinationConn
    Dim DestinationRecordset

    Set SourceConn = CreateObject("ADODB.Connection")
    Set DestinationConn = CreateObject("ADODB.Connection")

    Set SourceRecordset = CreateObject("ADODB.Recordset")
    Set SourceRecordset2 = CreateObject("ADODB.Recordset")
    
    Set DestinationRecordset = CreateObject("ADODB.Recordset")
    DestinationRecordset.CursorType = adOpenDynamic
    DestinationRecordset.CursorLocation = 3
    DestinationRecordset.LockType = 3
    
'Add Indiana processids to Cribmaster job table
    SourceConn.Open = "Provider=SQLOLEDB.1;Data Source=BUSCHE-SQL; Initial Catalog=Busche ToolList;user id = 'sa';password='buschecnc1'"
    DestinationConn.Open = "Provider=SQLOLEDB.1;Data Source=BUSCHE-SQL; Initial Catalog=Cribmaster;user id = 'sa';password='buschecnc1'"
    
    DestinationRecordset.Open "update [User4] set [UserInactive] = 1", DestinationConn
    DestinationRecordset.Open "update [User4] set [UserInactive] = 0 where name in ('MISC','ENGINEERING','TOOLBOSS02','TOOLBOSS03','TOOLBOSS05','TOOLBOSS06','TOOLBOSS07','TOOLBOSS08','TOOLBOSS09','TOOLBOSS11','TOOLBOSS11B')", DestinationConn
    
    
    SourceRecordset.Open "SELECT OriginalProcessID as ID, Customer + ' - IN - ' + PartFamily + ' - ' + OperationDescription as Name, " & _
    "Obsolete as UserInactive, [ToolList PartNumbers].PartNumbers as Comments " & _
    "FROM [ToolList Master] INNER JOIN " & _
    "[ToolList PartNumbers] ON [ToolList Master].ProcessID = [ToolList PartNumbers].ProcessID", SourceConn

    'Add Indiana's processids to Cribmaster job table
    ' we never delete any toollists from the cribmaster.  Fairly deleting old inactive toollists will mess up older toolcost reports
    DestinationRecordset.Open "USER4", DestinationConn, adOpenKeyset, adCmdTable
    On Error Resume Next
    While Not SourceRecordset.EOF
        DestinationRecordset.Find "ID = '" & SourceRecordset.Fields("ID") & "'"
        If Not DestinationRecordset.EOF Then
            DestinationRecordset.Fields("UserInactive") = SourceRecordset.Fields("UserInactive")
            DestinationRecordset.Fields("Name") = Left(SourceRecordset.Fields("Name"), 50)
            DestinationRecordset.Fields("Comments") = SourceRecordset.Fields("Comments")
            DestinationRecordset.Fields("UserSiteID") = "DEFAULT"
            DestinationRecordset.Update
        Else
            DestinationRecordset.AddNew
            DestinationRecordset.Fields("ID") = SourceRecordset.Fields("ID")
            DestinationRecordset.Fields("UserInactive") = SourceRecordset.Fields("UserInactive")
            DestinationRecordset.Fields("Name") = Left(SourceRecordset.Fields("Name"), 50)
            DestinationRecordset.Fields("Comments") = SourceRecordset.Fields("Comments")
            DestinationRecordset.Fields("UserSiteID") = "DEFAULT"
            DestinationRecordset.Update
        End If
        DestinationRecordset.MoveFirst

        SourceRecordset.MoveNext
    Wend
    SourceRecordset.Close
    DestinationRecordset.Close

'UserItem4 contains processid / itemnumber combos to determine which items are for what jobs
    DestinationRecordset.Open "DELETE FROM [UserItem4]", DestinationConn

'Add Indiana ToolList items to Cribmaster job/items table
' There could be many revisions of a toollist with the same originalprocessid so make sure duplicates do not
' get added to the useritem4 table
    
    SourceRecordset.Open "select distinct [sub].ItemNumber, [sub].ID from ( " & _
    "SELECT DISTINCT CribToolID as ItemNumber, OriginalProcessID as ID FROM [ToolList Item] " & _
    "INNER JOIN [ToolList Master] on [ToolList Item].ProcessID = [ToolList Master].ProcessID UNION ALL " & _
    "SELECT DISTINCT CribToolID as ItemNumber, OriginalProcessID as ID FROM [ToolList Misc] INNER JOIN " & _
    "[ToolList Master] on [ToolList Misc].ProcessID = [ToolList Master].ProcessID UNION ALL SELECT DISTINCT " & _
    "CribToolID as ItemNumber,OriginalProcessID as ID FROM [ToolList Fixture] INNER JOIN [ToolList Master] on " & _
    "[ToolList Fixture].ProcessID = [ToolList Master].ProcessID ) as sub where itemNumber not like '%R'", SourceConn
    
    DestinationRecordset.Open "UserItem4", DestinationConn, adOpenKeyset, adCmdTable

    While Not SourceRecordset.EOF
        DestinationRecordset.AddNew
        DestinationRecordset.Fields("ID") = SourceRecordset.Fields("ID")
        DestinationRecordset.Fields("ItemNumber") = SourceRecordset.Fields("ItemNumber")
        DestinationRecordset.Update
        DestinationRecordset.AddNew
        DestinationRecordset.Fields("ID") = SourceRecordset.Fields("ID")
        DestinationRecordset.Fields("ItemNumber") = SourceRecordset.Fields("ItemNumber") + "R"
        DestinationRecordset.Update
        SourceRecordset.MoveNext
    Wend
    SourceRecordset.Close
    DestinationRecordset.Close
    SourceRecordset2.Close
    SourceConn.Close
    DestinationConn.Close
    Main = DTSTaskExecResult_Success
End Function
