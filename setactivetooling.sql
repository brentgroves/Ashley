Function Main()
'**********************************************************************
'  Visual Basic ActiveX Script
'************************************************************************

    Dim SourceConn
    Dim SourceRecordset
    Dim DestinationConn
    Dim DestinationRecordset

    Set SourceConn = CreateObject("ADODB.Connection")
    Set DestinationConn = CreateObject("ADODB.Connection")

    Set SourceRecordset = CreateObject("ADODB.Recordset")
    Set DestinationRecordset = CreateObject("ADODB.Recordset")
    DestinationRecordset.CursorType = adOpenDynamic
    DestinationRecordset.CursorLocation = 3
    DestinationRecordset.LockType = 3
    SourceRecordset.CursorType = adOpenDynamic
    SourceRecordset.CursorLocation = 3
    SourceRecordset.LockType = 3
    SourceConn.Open = "Provider=SQLOLEDB.1;Data Source=BUSCHE-SQL; Initial Catalog=Busche ToolList;user id = 'sa';password='buschecnc1'"
    DestinationConn.Open = "Provider=SQLOLEDB.1;Data Source=BUSCHE-SQL; Initial Catalog=Cribmaster;user id = 'sa';password='buschecnc1'"

    'Fill the Indiana Toollist recordset
    SourceRecordset.Open "SELECT DISTINCT CribToolID as ItemNumber, ToolDescription as Desciption1, 0 as InactiveItem FROM [ToolList Item] INNER JOIN [ToolList Master] on [ToolList Item].ProcessID = [ToolList Master].ProcessID Where [ToolList Master].Obsolete = 0 UNION ALL SELECT DISTINCT CribToolID as ItemNumber, ToolDescription as Desciption1, 0 as InactiveItem FROM [ToolList Misc] INNER JOIN [ToolList Master] on [ToolList Misc].ProcessID = [ToolList Master].ProcessID Where [ToolList Master].Obsolete = 0 UNION ALL SELECT DISTINCT CribToolID as ItemNumber, ToolDescription as Desciption1, 0 as InactiveItem FROM [ToolList Fixture] INNER JOIN [ToolList Master] on [ToolList Fixture].ProcessID = [ToolList Master].ProcessID Where [ToolList Master].Obsolete = 0 ORDER BY ItemNumber", SourceConn

    'Set all cribmaster items to inactive
    DestinationRecordset.Open "UPDATE Inventry SET InactiveItem = 1 " & _
       "WHERE ItemClass NOT LIKE 'FIXTURE COMP.' " & _
       "and ItemClass NOT LIKE 'SWING CLAMP' " & _
       "AND ItemClass NOT LIKE 'MISC' " & _
       "AND ItemClass NOT LIKE 'SEALS' " & _
       "AND ITEMTYPE <> 4", DestinationConn
    'Set all global cribmaster items to active
    DestinationRecordset.Open "UPDATE Inventry SET InactiveItem = 0 WHERE UDFGLOBALTOOL = 'YES'", DestinationConn
    
    'Fill recordset with all cribmaster items
    DestinationRecordset.Open "SELECT * FROM Inventry ORDER BY ItemNumber", DestinationConn

    'Loop through Indiana toollist items and set them active in the cribmaster
    While Not SourceRecordset.EOF
        DestinationRecordset.Find "Itemnumber = '" & SourceRecordset.Fields("ItemNumber") & "'"
        If Not DestinationRecordset.EOF Then
            DestinationRecordset.Fields("InactiveItem") = 0
            DestinationRecordset.Update
        End If
        DestinationRecordset.MoveFirst
        DestinationRecordset.Find "Itemnumber = '" & SourceRecordset.Fields("ItemNumber") & "R'"
        If Not DestinationRecordset.EOF Then
            DestinationRecordset.Fields("InactiveItem") = 0
            DestinationRecordset.Update
        End If
        DestinationRecordset.MoveFirst
        SourceRecordset.MoveNext
    Wend
    
'Add Hartselle toollist items to cribmaster
    'DestinationRecordset.Close
    'DestinationConn.Close
    'DestinationRecordset.CursorType = adOpenDynamic
    'DestinationRecordset.CursorLocation = 3
    'DestinationRecordset.LockType = 3
    'SourceRecordset.Close
    'SourceConn.Close
    'SourceRecordset.CursorType = adOpenDynamic
    'SourceRecordset.CursorLocation = 3
    'SourceRecordset.LockType = 3
    'SourceConn.Open = "Provider=SQLOLEDB.1;Data Source=hartselle-sql; Initial Catalog=Busche ToolList;user id = 'sa';password='buschecnc1'"
    'DestinationConn.Open = "Provider=SQLOLEDB.1;Data Source=hartselle-sql-1; Initial Catalog=Cribmaster;user id = 'sa';password='buschecnc1'"
    'Fill the Hartselle Toollist recordset
    'SourceRecordset.Open "SELECT DISTINCT CribToolID as ItemNumber, ToolDescription as Desciption1, 0 as InactiveItem FROM [ToolList Item] INNER JOIN [ToolList Master] on [ToolList Item].ProcessID = [ToolList Master].ProcessID Where [ToolList Master].Obsolete = 0 UNION ALL SELECT DISTINCT CribToolID as ItemNumber, ToolDescription as Desciption1, 0 as InactiveItem FROM [ToolList Misc] INNER JOIN [ToolList Master] on [ToolList Misc].ProcessID = [ToolList Master].ProcessID Where [ToolList Master].Obsolete = 0 UNION ALL SELECT DISTINCT CribToolID as ItemNumber, ToolDescription as Desciption1, 0 as InactiveItem FROM [ToolList Fixture] INNER JOIN [ToolList Master] on [ToolList Fixture].ProcessID = [ToolList Master].ProcessID Where [ToolList Master].Obsolete = 0 ORDER BY ItemNumber", SourceConn
    
    'Loop through Hartselle toollist items and set them active in the cribmaster
    'DestinationRecordset.MoveFirst
    'While Not SourceRecordset.EOF
     '   DestinationRecordset.Find "Itemnumber = '" & SourceRecordset.Fields("ItemNumber") & "'"
      '  If Not DestinationRecordset.EOF Then
       '     DestinationRecordset.Fields("InactiveItem") = 0
        '    DestinationRecordset.Update
        'End If
        'DestinationRecordset.MoveFirst
        'DestinationRecordset.Find "Itemnumber = '" & SourceRecordset.Fields("ItemNumber") & "R'"
        'If Not DestinationRecordset.EOF Then
         '   DestinationRecordset.Fields("InactiveItem") = 0
          '  DestinationRecordset.Update
        'End If
        'DestinationRecordset.MoveFirst
        'SourceRecordset.MoveNext
    'Wend
    
'Set related cribmaster items active
    DestinationRecordset.MoveFirst
    SourceRecordset.Close
    SourceConn.Close 'Only need a connection to the cribmaster from now on
    SourceRecordset.CursorType = adOpenDynamic
    SourceRecordset.CursorLocation = 3
    SourceRecordset.LockType = 2
    
    'Fill recordset with item with related items than can be issued
    SourceRecordset.Open "SELECT * FROM ITEMRELATIONSHIP WHERE RELATIONSHIPTYPEID = 2 ORDER BY ITEMNUMBER", DestinationConn
    
    While Not SourceRecordset.EOF
        DestinationRecordset.Find "Itemnumber = '" & SourceRecordset.Fields("ItemNumber") & "'"
        If Not DestinationRecordset.EOF Then
            If DestinationRecordset.Fields("InactiveItem") = 0 Then
                DestinationRecordset.MoveFirst
                DestinationRecordset.Find "Itemnumber = '" & SourceRecordset.Fields("RelatedItemNumber") & "'"
                If Not DestinationRecordset.EOF Then
                    DestinationRecordset.Fields("InactiveItem") = 0
                    DestinationRecordset.Update
                End If
            End If
        End If
        DestinationRecordset.MoveFirst
        SourceRecordset.MoveNext
    Wend
    
    
    DestinationRecordset.Close
    SourceRecordset.Close
'    SourceConn.Close already closed
    DestinationConn.Close
        
    Main = DTSTaskExecResult_Success    
End Function
