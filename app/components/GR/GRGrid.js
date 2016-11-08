import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as GRSTATE from "../../actions/GRState.js"


var catRecs = [{}],vendors=[{}],m2mVendors=[{}];
// can't find a way for onAfterSaveCell() to access this.props??
var updateChk1,updateChk2;


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

export default class GRGrid extends React.Component{
  static propTypes = {
    GenR: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
//      updateChk1:this.props.updateChk1
    };

  }

  cellEditPropChk1 = {
    mode: "dbclick",
    blurToSave: true,
    afterSaveCell: this.onAfterSaveCellChk1.bind(this)

  };

  onAfterSaveCellChk1(row, cellName, cellValue){
    if ('development'==process.env.NODE_ENV) {
      console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
      console.log("Thw whole row :");
      console.log(row);
      console.log(`this = `);
      console.dir(this);
    }
  }

// validator function pass the user input value and should return true|false.
  fpacklistValidator(value){
    let pl = value.trim();
    if(!value){
      return 'Packing List is required!'
    }else if((pl.length<4)||(pl.length>15)){
      return `Packing List must be 4 to 15 characters in length.`
    }
    return true;
  }

//table-striped table-bordered table-condensed
  render(){

    var whichTable;
        whichTable = 
         <BootstrapTable  
            data={this.props.GenR.rcmast} pagination 
            trClassName={trClassFormat}          
            tableHeaderClass='my-header-class'
            tableBodyClass='my-body-class'
            containerClass='my-container-class'
            tableContainerClass='my-table-container-class'
            headerContainerClass='my-header-container-class'
            bodyContainerClass='my-body-container-class'
            hover={true} bordered={true} condensed={true} 
            cellEdit={this.cellEditPropChk1} insertRow={false}>
            <TableHeaderColumn dataField="id" hidden={true} isKey={true}>Row</TableHeaderColumn>
            <TableHeaderColumn dataField="fpono" width="155" columnClassName='td-first-column' editable={false} >PO Number</TableHeaderColumn>
            <TableHeaderColumn dataField="rcvdate" width="155" editable={false} >Date</TableHeaderColumn>
            <TableHeaderColumn dataField="fcompany" width="300" editable={false} >Company</TableHeaderColumn>
            <TableHeaderColumn dataField="fpacklist" width="200" editable={{type:'text', validator:this.fpacklistValidator}} >Packing List</TableHeaderColumn>
            <TableHeaderColumn dataField="carrier" width="200" columnClassName={columnClassNameFormat} 
            editable={{type:'select', options:{values:this.props.GenR.shipVia}}}>Select Carrier</TableHeaderColumn>
          </BootstrapTable>;
    return ( <div>{whichTable}</div> );
  }
};

