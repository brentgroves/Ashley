import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import POReqTrans from '../api/POReqTrans';
//import GithubUsers from './GithubUsers';

var cellEditProp = {
  mode: "click",
  blurToSave: true
};

// validator function pass the user input value and should return true|false.
function jobNameValidator(value){
  if(!value){
    return 'Job Name is required!'
  }else if(value.length<10){
    return 'Job Name length must great 10 char'
  }
  return true;
}

export default class PORTChk1 extends React.Component{
  static propTypes = {
    POReqTrans: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
 //     loading: false PONumber,Item,UDF_POCATEGORY
    };

  }

  render(){
    var t;
    t=1;
    return (
      <BootstrapTable data={this.props.POReqTrans.noCatList} cellEdit={cellEditProp} insertRow={true}>
          <TableHeaderColumn dataField="PONumber" isKey={false}>PO Number</TableHeaderColumn>
          <TableHeaderColumn dataField="Item" isKey={true}>Item Number</TableHeaderColumn>
          <TableHeaderColumn dataField="UDF_POCATEGORY" isKey={false}>UDF_POCATEGORY</TableHeaderColumn>
      </BootstrapTable>
    );
  }
};

/* PONumber,Item,UDF_POCATEGORY
      <BootstrapTable data={this.props.POReqTrans.noCatList} cellEdit={cellEditProp} insertRow={true}>
          <TableHeaderColumn dataField="id" isKey={true}>Job ID</TableHeaderColumn>
          <TableHeaderColumn dataField="name" editable={{type:'textarea', validator:jobNameValidator}}>Job Name</TableHeaderColumn>
          <TableHeaderColumn dataField="type" editable={{type:'select', options:{values:jobTypes}}}>Job Type</TableHeaderColumn>
          <TableHeaderColumn dataField="active" editable={{type:'checkbox', options:{values:'Y:N'}}}>Active</TableHeaderColumn>
      </BootstrapTable>

*/