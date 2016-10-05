import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import POReqTrans from '../api/POReqTrans';
//import GithubUsers from './GithubUsers';
/*
var cellEditProp = {
  mode: "click",
  blurToSave: true,
  afterSaveCell: onAfterSaveCell
};

var catToFind;

function checkCats(catRec) {
    return catRec.descr == catToFind;
}

function onAfterSaveCell(row, cellName, cellValue){
  console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
  console.log("Thw whole row :");
  console.log(row);
  catToFind = cellValue;
  let catRec=this.props.POReqTrans.catRecs.find(checkCats);
  console.log(`update podetail set UDF_POCATEGORY={catRec.UDF_POCATEGORY}`);
}

// validator function pass the user input value and should return true|false.
function jobNameValidator(value){
  if(!value){
    return 'Job Name is required!'
  }else if(value.length<10){
    return 'Job Name length must great 10 char'
  }
  return true;
}

*/
  function onAfterSaveCell(row, cellName, cellValue){
    console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
    console.log("Thw whole row :");
    console.log(row);
//    PORTChk1.catToFind = cellValue;
    catRecs.forEach(function(catRec,i,arr){
      console.log(catRec.descr);
      if(catRec.descr==cellValue){
        console.log(catRec.descr + "==" + cellValue);
        console.log(catRec.UDF_POCATEGORY);
      }else{
        console.log(catRec.descr + "!=" + cellValue);
      }
    });

//    let catRec=PORTChk1.catRecs.find(PORTChk1.checkCats);
 //   console.log(`update podetail set UDF_POCATEGORY={PORTChk1.catRec..UDF_POCATEGORY}`);
  }
var catRecs = [{}];

export default class PORTChk1 extends React.Component{
  static propTypes = {
    POReqTrans: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    catRecs=this.props.POReqTrans.catRecs;   
    this.state = {

 //     loading: false PONumber,Item,UDF_POCATEGORY
    };

  }

//  static catToFind = '';

  static cellEditProp = {
    mode: "click",
    blurToSave: true,
    afterSaveCell: onAfterSaveCell
  };




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
      <BootstrapTable  data={this.props.POReqTrans.noCatList} striped={true} hover={true} bordered={true} condensed={true} cellEdit={PORTChk1.cellEditProp} insertRow={false}>
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