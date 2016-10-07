import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import POReqTrans from '../api/POReqTrans';




function columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
  // fieldValue is column value
  // row is whole row object
  // rowIdx is index of row
  // colIdx is index of column
//  return rowIdx % 2 === 0 ? 'td-column-function-even-example' : 'td-column-function-odd-example';
  return 'cat-column';

}


function trClassFormat(rowData,rowIndex){
   return rowIndex%2==0?"tr-odd-example":"tr-even-example";  //return a class name.
}

export default class PORTChk2 extends React.Component{
  static propTypes = {
    POReqTrans: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {

 //     loading: false PONumber,Item,UDF_POCATEGORY
    };

  }



//table-striped table-bordered table-condensed
  render(){
    var tblStyle = {
        backgroundColor: 'white'
    }; 
    return (
     <BootstrapTable  
          data={this.props.POReqTrans.noCribVen} pagination 
          trClassName={trClassFormat}          
          tableHeaderClass='my-header-class'
          tableBodyClass='my-body-class'
          containerClass='my-container-class'
          tableContainerClass='my-table-container-class'
          headerContainerClass='my-header-container-class'
          bodyContainerClass='my-body-container-class'
          hover={true} bordered={true} condensed={true} 
          cellEdit={this.cellEditProp} insertRow={false}>
          <TableHeaderColumn dataField="id" isKey={true} columnClassName='td-first-column' >Row</TableHeaderColumn>
          <TableHeaderColumn dataField="PONumber" editable={false} >PO Number</TableHeaderColumn>
          <TableHeaderColumn dataField="Address1" editable={false} >Address1</TableHeaderColumn>
      </BootstrapTable>

     );
  }
};

/*
     <BootstrapTable  
          data={this.props.POReqTrans.noCribVen} pagination 
          trClassName={trClassFormat}          
          tableHeaderClass='my-header-class'
          tableBodyClass='my-body-class'
          containerClass='my-container-class'
          tableContainerClass='my-table-container-class'
          headerContainerClass='my-header-container-class'
          bodyContainerClass='my-body-container-class'
          hover={true} bordered={true} condensed={true} 
          cellEdit={this.cellEditProp} insertRow={false}>
          <TableHeaderColumn dataField="id" isKey={true} columnClassName='td-first-column' >Row</TableHeaderColumn>
          <TableHeaderColumn dataField="PONumber" editable={false} >PO Number</TableHeaderColumn>
          <TableHeaderColumn dataField="Address1" editable={false} >Address1</TableHeaderColumn>
      </BootstrapTable>

*/