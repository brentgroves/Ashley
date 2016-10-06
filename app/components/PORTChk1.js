import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import POReqTrans from '../api/POReqTrans';

//import GithubUsers from './GithubUsers';
var catRecs = [{}];
// can't find a way for onAfterSaveCell() to access this.props??
var cancelApp,updateChk1;

export default class PORTChk1 extends React.Component{
  static propTypes = {
    POReqTrans: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    // this bind has no affect.
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    updateChk1=this.props.updateChk1;
    catRecs=this.props.POReqTrans.catRecs;
    cancelApp=this.props.cancelApp;
    this.state = {

 //     loading: false PONumber,Item,UDF_POCATEGORY
    };

  }

//  static catToFind = '';

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

//    cancelApp();
  }


/*  static checkCats(catRec) {
      return catRec.descr == PORTChk1.catToFind;
  }
*/


//table-striped table-bordered table-condensed
  render(){
    var tblStyle = {
        backgroundColor: 'white'
    };
//      <div style={tblStyle}>

    var t;
    t=1;
    return (
<div className="container" style={tblStyle}>
      <BootstrapTable  data={this.props.POReqTrans.noCatList} striped={true} hover={true} bordered={true} condensed={true} cellEdit={this.cellEditProp} insertRow={false}>
          <TableHeaderColumn dataField="id" isKey={true} >Row</TableHeaderColumn>
          <TableHeaderColumn dataField="PONumber" editable={false} >PO Number</TableHeaderColumn>
          <TableHeaderColumn dataField="Item" editable={false} >Item Number</TableHeaderColumn>
          <TableHeaderColumn dataField="ItemDescription" editable={false} >Item Description</TableHeaderColumn>
          <TableHeaderColumn dataField="type" width="275" editable={{type:'select', options:{values:this.props.POReqTrans.catTypes}}}>Category</TableHeaderColumn>
      </BootstrapTable>
      </div>
    );
  }
};

/* PONumber,Item,UDF_POCATEGORY
          <TableHeaderColumn dataField="UDF_POCATEGORY" isKey={false}>Category</TableHeaderColumn>

      <BootstrapTable data={this.props.POReqTrans.noCatList} cellEdit={cellEditProp} insertRow={true}>
          <TableHeaderColumn dataField="id" isKey={true}>Job ID</TableHeaderColumn>
          <TableHeaderColumn dataField="name" editable={{type:'textarea', validator:jobNameValidator}}>Job Name</TableHeaderColumn>
          <TableHeaderColumn dataField="type" editable={{type:'select', options:{values:jobTypes}}}>Job Type</TableHeaderColumn>
          <TableHeaderColumn dataField="active" editable={{type:'checkbox', options:{values:'Y:N'}}}>Active</TableHeaderColumn>
      </BootstrapTable>

*/