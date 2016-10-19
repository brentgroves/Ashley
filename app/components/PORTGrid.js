import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as PORTSTATE from "../actions/PORTState.js"


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

export default class PORTGrid extends React.Component{
  static propTypes = {
    POReqTrans: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    updateChk1=this.props.updateChk1;
    updateChk2=this.props.updateChk2;
    catRecs=this.props.POReqTrans.catRecs;
 //   vendors=this.props.POReqTrans.vendors;
  //  m2mVendors=this.props.POReqTrans.m2mVendors;
    this.state = {
//      updateChk1:this.props.updateChk1
    };

  }

  cellEditPropChk1 = {
    mode: "click",
    blurToSave: true,
    afterSaveCell: this.onAfterSaveCellChk1.bind(this)
  };

  onAfterSaveCellChk1(row, cellName, cellValue){
    console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
    console.log("Thw whole row :");
    console.log(row);
    console.log(`this = `);
    console.dir(this);
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
      this.props.updateChk1(row.PONumber,row.Item,newPOCategory,this.props.startPORT);
//      this.props.startPORT();
    }
  }

  cellEditPropChk2 = {
    mode: "click",
    blurToSave: true,
    afterSaveCell: this.onAfterSaveCellChk2.bind(this)
  };

  onAfterSaveCellChk2(row, cellName, cellValue){
    console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
    console.log("Thw whole row :");
    console.dir(row);
    var found=false;
    var newVendor,
    Address1='',
    Address2='',
    Address3='',
    Address4='';
    this.props.POReqTrans.vendors.every(function(vendor,i,arr){
      console.log(vendor.Description);
      if(vendor.Description==cellValue){
        console.log(vendor.Description + "==" + cellValue);
        console.log(vendor.VendorNumber);
        newVendor=vendor.VendorNumber;
        Address1=vendor.VendorName;
        if(vendor.PurchaseAddress1){
          Address2=vendor.PurchaseAddress1;
          if(vendor.PurchaseAddress2){
            Address3=vendor.PurchaseAddress2;
            if(vendor.PurchaseCity && vendor.PurchaseState && vendor.PurchaseZip){
              Address4=vendor.PurchaseCity + ',' + vendor.PurchaseState + ' ' + vendor.PurchaseZip;
            }else if(vendor.PurchaseCity && vendor.PurchaseState){ 
              Address4=vendor.PurchaseCity + ',' + vendor.PurchaseState;
            }else if(vendor.PurchaseCity){ 
              Address4=vendor.PurchaseCity;
            }
          }else{
            if(vendor.PurchaseCity && vendor.PurchaseState && vendor.PurchaseZip){
              Address3=vendor.PurchaseCity + ',' + vendor.PurchaseState + ' ' + vendor.PurchaseZip;
            }else if(vendor.PurchaseCity && vendor.PurchaseState){ 
              Address3=vendor.PurchaseCity + ',' + vendor.PurchaseState;
            }else if(vendor.PurchaseCity){ 
              Address3=vendor.PurchaseCity;
            }
          }
        }else{
          if(vendor.PurchaseCity && vendor.PurchaseState && vendor.PurchaseZip){
            Address2=vendor.PurchaseCity + ',' + vendor.PurchaseState + ' ' + vendor.PurchaseZip;
          }else if(vendor.PurchaseCity && vendor.PurchaseState){ 
            Address2=vendor.PurchaseCity + ',' + vendor.PurchaseState;
          }else if(vendor.PurchaseCity){ 
            Address2=vendor.PurchaseCity;
          }
        }
        //VendorName,PurchaseAddress1,PurchaseAddress2,PurchaseCity,PurchaseState,PurchaseZip

        found=true;
      // false breaks loop
        return false;
      }else{
//        console.log(catRec.descr + "!=" + cellValue);
        return true;

      }
    });
    if(found){
      console.log(`PORTGrid.updateChk2 => ${row.PONumber},${newVendor},${Address1},${Address2},${Address3},${Address4}`);
      this.props.updateChk2(row.PONumber,newVendor,Address1,Address2,Address3,Address4,this.props.startPORT);
    }

  }

  cellEditPropChk3 = {
    mode: "click",
    blurToSave: true,
    afterSaveCell: this.onAfterSaveCellChk3.bind(this)
  };

  onAfterSaveCellChk3(row, cellName, cellValue){
    console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
    console.log("Thw whole row :");
    console.dir(row);
    var found=false;
    var newM2mVendor;
    this.props.POReqTrans.m2mVendors.every(function(m2mVendor,i,arr){
      console.log(m2mVendor.vendorSelect);
      if(m2mVendor.vendorSelect==cellValue){
        console.log(m2mVendor.vendorSelect + "==" + cellValue);
        newM2mVendor=m2mVendor.VendorNumber;
        found=true;
      // false breaks loop
        return false;
      }else{
        return true;

      }
    });
    if(found){
      this.props.updateChk3(row.VendorNumber,newM2mVendor,this.props.startPORT);
    }

  }

//table-striped table-bordered table-condensed
  render(){

    var whichTable;
    switch (this.props.POReqTrans.state) {
      case PORTSTATE.STEP_10_FAIL:
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
            cellEdit={this.cellEditPropChk1} insertRow={false}>
            <TableHeaderColumn dataField="id" hidden={true} isKey={true}>Row</TableHeaderColumn>
            <TableHeaderColumn dataField="PONumber" columnClassName='td-first-column' editable={false} >PO Number</TableHeaderColumn>
            <TableHeaderColumn dataField="Item" editable={false} >Item Number</TableHeaderColumn>
            <TableHeaderColumn dataField="ItemDescription" editable={false} >Item Description</TableHeaderColumn>
            <TableHeaderColumn dataField="type" width="275" columnClassName={columnClassNameFormat} 
            editable={{type:'select', options:{values:this.props.POReqTrans.catTypes}}}>Select Category</TableHeaderColumn>
          </BootstrapTable>;
          break;
      case PORTSTATE.STEP_20_FAIL:
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
              cellEdit={this.cellEditPropChk2} insertRow={false}>
              <TableHeaderColumn dataField="id" hidden={true} isKey={true}>Row</TableHeaderColumn>
              <TableHeaderColumn dataField="PONumber" columnClassName='td-first-column' isKey={false} editable={false} >PO Number</TableHeaderColumn>
              <TableHeaderColumn dataField="Address1" editable={false} >Vendor</TableHeaderColumn>
              <TableHeaderColumn dataField="m2mVendor" width="275" columnClassName={columnClassNameFormat} 
              editable={{type:'select', options:{values:this.props.POReqTrans.vendorSelect}}}>Select Vendor</TableHeaderColumn>
          </BootstrapTable>;
          break;
      case PORTSTATE.STEP_30_FAIL:
        whichTable = 
         <BootstrapTable  
              data={this.props.POReqTrans.noM2mVen} pagination 
              trClassName={trClassFormat}          
              tableHeaderClass='my-header-class'
              tableBodyClass='my-body-class'
              containerClass='my-container-class'
              tableContainerClass='my-table-container-class'
              headerContainerClass='my-header-container-class'
              bodyContainerClass='my-body-container-class'
              hover={true} bordered={true} condensed={true} 
              cellEdit={this.cellEditPropChk3} insertRow={false}>
              <TableHeaderColumn dataField="id" hidden={true} isKey={true}>Row</TableHeaderColumn>
              <TableHeaderColumn dataField="PONumber" columnClassName='td-first-column' isKey={false} editable={false} >PO Number</TableHeaderColumn>
              <TableHeaderColumn dataField="Address1" editable={false} >Vendor</TableHeaderColumn>
              <TableHeaderColumn dataField="VendorNumber" editable={false} >Crib Vendor</TableHeaderColumn>
              <TableHeaderColumn dataField="vendor" width="275" columnClassName={columnClassNameFormat} 
              editable={{type:'select', options:{values:this.props.POReqTrans.m2mVendorSelect}}}>Select M2M Vendor</TableHeaderColumn>
          </BootstrapTable>;
          break;
    }
    return ( <div>{whichTable}</div> );
  }
};

