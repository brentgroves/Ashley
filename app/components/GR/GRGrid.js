import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as GRSTATE from "../../actions/GRState.js"
var _ = require('lodash');

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
    mode: "click",
    blurToSave: true,
  //  beforeSaveCell:this.onBeforeSaveCellChk1.bind(this),
    afterSaveCell: this.onAfterSaveCellChk1.bind(this)

  };
/*
  onBeforeSaveCellChk1(row, cellName, cellValue){
    if ('development'==process.env.NODE_ENV) {
      console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
      console.log("Thw whole row :");
      console.log(row);
    }

    let pl = cellValue.trim();
    if(!pl){
      return 'Packing List is required!'
    }else if((pl.length<4)||(pl.length>15)){
      console.log(`length is ${pl.length}`)
      return `Packing List must be 4 to 15 characters in length.`

    }
    return true;

  }
*/
  packlistOk(rcm) {

    var readyToInsert=false;
    if((rcm.fpacklist.trim().length>=4)&&(rcm.fpacklist.trim().length<=15)){
      readyToInsert=true;
    }
    if ('development'==process.env.NODE_ENV) {
      console.log(`packlistOk.rcm => `);
      console.dir(rcm);
      console.log(`readyToInsert => ${readyToInsert} `);
    }
    return readyToInsert;
  }

  onAfterSaveCellChk1(row, cellName, cellValue){
    if ('development'==process.env.NODE_ENV) {
      console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
      console.log("Thw whole row :");
      console.log(row);
      console.log(`this = `);
      console.dir(this);
    }
    var rcmast=this.props.GenR.rcmast;
    let newValue=cellValue.trim();
    var newRCMast=[];
    var identity_column=row.identity_column;
    rcmast.forEach(function(oldRCMast,i,arr){
      if(oldRCMast.identity_column==identity_column){
        if ('development'==process.env.NODE_ENV) {
          console.log(oldRCMast.identity_column + "==" + identity_column);
        }
        if('ffrtcarr'==cellName){
          oldRCMast.ffrtcarr=newValue;
        }else if('fpacklist'==cellName){
          oldRCMast.fpacklist=newValue;
        }  
      }else{
      }
      newRCMast.push(oldRCMast);

    });
    this.props.setRCMast(newRCMast);
    /*
    readyToInsert=rcmast.find(this.packlistOk.bind(this));
    if ('development'==process.env.NODE_ENV) {
      console.log(`onAfterSaveCellChk1.readyToInsert =>`);
      console.dir(readyToInsert);
    }*/

    let notReadyCnt=_.size(_.filter(newRCMast, function(o) { return 0==o.fpacklist.trim().length; }));
    if ('development'==process.env.NODE_ENV) {
      console.log(`notReadyCnt => ${notReadyCnt}`);
    }


    /*
    rcmast.forEach(function(rcm,i,arr){
      if(rcm.fpacklist && rcm.ffrtcarr){
        if((rcm.fpacklist.trim().length>=4)||(rcm.fpacklist.trim().length<=15)){
          readyToInsert=true;
        }
      }
    });
    */
    if(notReadyCnt<=5){
      this.props.setState(GRSTATE.RCMAST_INSERT_READY);
    }else{
      this.props.setState(GRSTATE.RCMAST_INSERT_NOT_READY);
    }

  }

// validator function pass the user input value and should return true|false.
  fpacklistValidator(value){
    let pl = value.trim();
    let retVal=true;
    if(!value || 0==pl.length){
      retVal=true;
      //return 'Packing List is required!'
    }else if((pl.length<4)||(pl.length>15)){
      retVal = `Packing List must be 4 to 15 characters in length.`
    }
    return retVal;
  }

//table-striped table-bordered table-condensed editable={{type:'text', validator:this.fpacklistValidator}}
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
            <TableHeaderColumn dataField="identity_column" hidden={true} isKey={true}>Row</TableHeaderColumn>
            <TableHeaderColumn dataField="fpono" width="155" columnClassName='td-first-column' editable={false} >PO Number</TableHeaderColumn>
            <TableHeaderColumn dataField="freceiver" width="155" editable={false} >Receiver</TableHeaderColumn>
            <TableHeaderColumn dataField="fcompany" width="300" editable={false} >Company</TableHeaderColumn>
            <TableHeaderColumn dataField="fpacklist" width="200" editable={{type:'text', validator:this.fpacklistValidator}}  >Packing List</TableHeaderColumn>
            <TableHeaderColumn dataField="ffrtcarr" width="200" columnClassName={columnClassNameFormat} 
            editable={{type:'select', options:{values:this.props.GenR.shipVia}}}>Select Carrier</TableHeaderColumn>
          </BootstrapTable>;
    return ( <div>{whichTable}</div> );
  }
};

