import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


var catRecs = [{}];
// can't find a way for onAfterSaveCell() to access this.props??
var updateChk1;


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

export default class PORTGrid extends React.Component{
  static propTypes = {
    POReqTrans: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    // this bind has no affect??
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    updateChk1=this.props.updateChk1;
    catRecs=this.props.POReqTrans.catRecs;
    this.state = {
 //     loading: false PONumber,Item,UDF_POCATEGORY
    };

  }

  cellEditProp = {
    mode: "click",
    blurToSave: true,
    afterSaveCell: this.onAfterSaveCell
  };

  onAfterSaveCell(row, cellName, cellValue){
    console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
    console.log("Thw whole row :");
    console.log(row);
    var found=false;
    var newPOCategory;
    catRecs.every(function(catRec,i,arr){
      console.log(catRec.descr);
      if(catRec.descr==cellValue){
        console.log(catRec.descr + "==" + cellValue);
        console.log(catRec.UDF_POCATEGORY);
        newPOCategory=catRec.UDF_POCATEGORY;
        found=true;
      // false breaks loop
        return false;
      }else{
        console.log(catRec.descr + "!=" + cellValue);
        return true;

      }
      //return catRec.descr!=cellValue
    });
    if(found){
      updateChk1(row.PONumber,row.Item,newPOCategory);
    }
  }



//table-striped table-bordered table-condensed
  render(){

    var whichTable;
    if("failure"==this.props.POReqTrans.chk1){
      whichTable = 
     <BootstrapTable  
          data={this.props.POReqTrans.noCatList} pagination 
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
          <TableHeaderColumn dataField="Item" editable={false} >Item Number</TableHeaderColumn>
          <TableHeaderColumn dataField="ItemDescription" editable={false} >Item Description</TableHeaderColumn>
          <TableHeaderColumn dataField="type" width="275" columnClassName={columnClassNameFormat} editable={{type:'select', options:{values:this.props.POReqTrans.catTypes}}}>Category</TableHeaderColumn>
      </BootstrapTable>;
    } else if("failure"==this.props.POReqTrans.chk2){
      whichTable = 
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
      </BootstrapTable>;

    }
    return ( <div>{whichTable}</div> );
  }
};
