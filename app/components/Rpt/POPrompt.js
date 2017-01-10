//require('../../react-pivot/example/demo.css')
import React, { Component, PropTypes } from 'react';
import { Row,Col,ListGroup,ListGroupItem,Panel,Table,Button,Glyphicon,ButtonGroup,ButtonToolbar} from 'react-bootstrap';
var classNames = require('classnames');
import * as STATE from "../../actions/Rpt/State.js"


//require('../../css/Rpt/styles.css')
import styles from '../../css/Rpt/styles.css';
var sorty    = require('sorty')
var _ = require('lodash');
var joins = require('lodash-joins');

var rowIndex=0;
var poitems=
[
  {fpono: "111111", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
  {fpono: "111111", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
  {fpono: "111112", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
  {fpono: "111112", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
  {fpono: "111113", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
  {fpono: "111113", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
];

var setStyle;
class PORow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poNumber:this.props.poItem.poNumber,
      vendorName:this.props.poItem.vendorName,
      eMailAddress:this.props.poItem.eMailAddress,
      visible:this.props.poItem.visible
    };
  }
/*
    if(this.state.poItem.selected){
      checkbox=<input type="checkbox" onChange={()=>this.state.toggleOpenPOSelected(fpono)}/>     
    }else{
      checkbox=<input type="checkbox" onChange={()=>this.state.toggleOpenPOSelected(fpono)} />     
    }
    */
  render() {
//    var poNumber=this.props.poItem.poNumber;
//    var vendorName=this.props.poItem.vendorName;
//    var eMailAddress=this.props.poItem.eMailAddress;
    var selected=this.props.poItem.selected;
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORow:poNumber=>${this.state.poNumber}`);
    }
    var checkbox;
    if(selected){
      checkbox=<input type="checkbox" checked onChange={()=>this.props.toggleOpenPOSelected(this.state.poNumber)}/>;     
    }else{
      checkbox=<input type="checkbox" onChange={()=>this.props.toggleOpenPOSelected(this.state.poNumber)}/>;     
    }
    var showButton;
    if(this.state.visible){
      showButton=
        <Button bsSize="xsmall" 
          onClick={()=>this.props.toggleOpenPOVisible(this.state.poNumber)}>
          <Glyphicon glyph="chevron-down" />
        </Button>     
    }else{
      showButton=
        <Button bsSize="xsmall" 
          onClick={()=>this.props.toggleOpenPOVisible(this.state.poNumber)}>
          <Glyphicon glyph="chevron-right" />
        </Button>     
    }
    var noEmailAddress=false;
    if('None'==this.state.eMailAddress){
      noEmailAddress=true;
    }

    var poStyle;
    if(noEmailAddress){
      poStyle={
        color:'red'
      }
    }else{
      poStyle={
      }
    }
 
    return (
      <tr >
        <th colSpan="4" >
          {showButton}
          <span style={{paddingLeft:25,color:'steelblue'}}>PO: </span> 
          {this.state.poNumber}{" / "}{this.state.vendorName}{' / '}
          <span style={poStyle}>
            {this.state.eMailAddress}
          </span>
          <span style={{paddingLeft:25,color:'steelblue'}}>Select: </span> 
          {checkbox}     
        </th>
      </tr>
    );
  }
}

class POItemRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    var myRow=null;
    var poNumber=this.props.poItem.poNumber;
    var itemDescription=this.props.poItem.itemDescription;
    var qtyOrd=this.props.poItem.qtyOrd;
    var qtyReceived=this.props.poItem.qtyReceived;
    if(true==this.props.poItem.visible){
      myRow=<tr>
            <td>{poNumber}</td>
            <td>{itemDescription}</td>
            <td>{qtyOrd}</td>
            <td>{qtyReceived}</td>
          </tr>;
    }  
    if ('development'==process.env.NODE_ENV) {
      console.log(`myRow=>`);
      console.dir(myRow);
    }

    return myRow;
  }
}

var rowsPerPage;
class OpenPOTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    if ('development'==process.env.NODE_ENV) {
    }
  }
  render() {
    var rows = [];
    var lastPO = null;
    if ('development'==process.env.NODE_ENV) {
      console.log(`OpenPOTable.render()=>`);
    }
    var poItem=this.props.poItem;
    var curPage=this.props.curPage;
    var toggleOpenPOSelected=this.props.toggleOpenPOSelected;
    var toggleOpenPOVisible=this.props.toggleOpenPOVisible;
    if ('development'==process.env.NODE_ENV) {
      console.log(`OpenPOTable.render().curPage=>${curPage}`);
    }
    poItem.forEach(function(poItem) {
      if (poItem.poNumber !== lastPO) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`poItem.poNumber=>${poItem.poNumber}`);
          console.log(`lastPO=>${lastPO}`);
          console.log(`poItem.poNumber !== lastPO`);
        }
        if(curPage==poItem.page){
          rows.push(<PORow 
                      toggleOpenPOSelected={toggleOpenPOSelected} 
                      toggleOpenPOVisible={toggleOpenPOVisible}
                      poItem={poItem} key={poItem.poNumber} />);          
        }

      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`poItem.poNumber=>${poItem.poNumber}`);
          console.log(`lastPO=>${lastPO}`);
          console.log(`poItem.poNumber === lastPO`);
        }

      }
      var key = poItem.poNumber+poItem.itemDescription;
      if(curPage==poItem.page){
        rows.push(<POItemRow poItem={poItem} key={key} />);
      }
      lastPO = poItem.poNumber;
    });
    return (
      <Table style={{marginTop:0,marginBottom:0}} fill striped bordered condensed >
        <thead>
          <tr className={styles.tableHeader}>
            <th>PO</th>
            <th>Description#</th>
            <th>Ordered</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  }
}

class SearchBar extends React.Component {
  render() {
    return (
      <form>
        <input type="text" placeholder="Search..." />
        <p>
          <input type="checkbox" />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
}
export default class POPrompt extends React.Component {
  static propTypes = {
    Rpt: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      test:this.test.bind(this)
    };
    if ('development'==process.env.NODE_ENV) {
      console.log(`POPrompt:this.props.toggleOpenPOSelected=>`);
      console.dir(this.props.toggleOpenPOSelected);
    }
  }
 
 test(greeting){
  console.log(`greeting: ${greeting}`);
 }

  render() {
    
    var footerClass = classNames(
      'panel-footer'
    );
    var col4Class = classNames(
      'col','col-xs-4'
    );
    var col8Class = classNames(
      'col','col-xs-8'
    );
    var pageClass = classNames(
      'pagination','hidden-xs', 'pull-right'
    );
    var pageNoClass = classNames(
      'pagination','hidden-xs', 'pull-left'
    );

    var btnSpaceClass = classNames(
      'btnSpace'
    );


    var pages = [];
    var poItem=this.props.Rpt.openPO.poItem;
    var curPage=this.props.Rpt.openPO.curPage;
    var maxPage=this.props.Rpt.openPO.maxPage;
    var prevPage=this.props.Rpt.openPO.prevPage;
    var nextPage=this.props.Rpt.openPO.nextPage;
    if ('development'==process.env.NODE_ENV) {
      console.log(`POPrompt.Render().curPage=>${curPage}`);
      console.log(`POPrompt.Render().maxPage=>${maxPage}`);
      console.log(`POPrompt.Render().prevPage=>${prevPage}`);
      console.log(`POPrompt.Render().nextPage=>${nextPage}`);
    }

    for(var x=1;x<=maxPage;x++){
        let page=x;
        pages.push(<li key={x}><a onClick={()=>{this.props.setOpenPOCurPage(page)}}>{x}</a></li>);
    }
  const rpt1Style = {
    fontWeight:'bold'
  };
    var saveAndBackBtn;
    if(
        (STATE.PO_PROMPT_NOT_READY==this.props.Rpt.state) 
      ){

      saveAndBackBtn = 
      <div>
        <Col xs={1}>
          <Button disabled style={{marginTop:15}} bsSize="large" bsStyle="success" onClick={()=>this.props.OpenPOVendorEmailReport()}>Run</Button>
        </Col>
        <Col xs={2}>
          <Button  style={{marginTop:15,marginLeft:15}} bsSize="large" bsStyle="info" onClick={()=>this.props.setState(STATE.OPENPO_DATE_RANGE_READY)}>Back</Button>
        </Col>
      </div>
    }else{
      saveAndBackBtn = 
      <div>
        <Col xs={1}>
          <Button style={{marginTop:15}} bsSize="large" bsStyle="success" onClick={()=>this.props.OpenPOVendorEmailReport()}>Run</Button>
        </Col>
        <Col xs={2}>
          <Button  style={{marginTop:15,marginLeft:15}} bsSize="large" bsStyle="info" onClick={()=>this.props.setState(STATE.OPENPO_DATE_RANGE_READY)}>Back</Button>
        </Col>
      </div>
    }

    return (
      <div>
          <OpenPOTable poItem={poItem} curPage={curPage}
            toggleOpenPOSelected={this.props.toggleOpenPOSelected} 
            toggleOpenPOVisible={this.props.toggleOpenPOVisible}/>
                <Row>
                  <Col xs={3}>
                    <ul className={pageNoClass}>
                      <li><span style={{color:'black'}} >Page {curPage} of {maxPage}</span></li>
                    </ul>
                  </Col>
                  {saveAndBackBtn}
                   <Col xs={6}>
                    <ul className={pageClass}>
                      <li><a onClick={()=>{this.props.setOpenPOPrevPage()}}>«</a></li>
                      <li><a onClick={()=>{this.props.setOpenPONextPage()}}>»</a></li>
                      {pages}  
                    </ul>
                  </Col>
                </Row>

      </div>
    );
  }
}


/*
            <table className={styles.tg}>
            <tbody>
              <tr>
                <td className={styles.btnPrimary} onClick={()=>this.props.setState(STATE.NOT_STARTED)} ><span style={rpt1Style}>Back</span></td>
                <td className={styles.btnSuccess} onClick={()=>this.props.OpenPOVendorEmailReport()} ><span style={rpt1Style}>Run</span></td>
              </tr>
              </tbody>
            </table>
                  </Col>
                   <Col xs={6}>
                    <ul className={pageClass}>
                      <li><a onClick={()=>{this.props.setOpenPOPrevPage()}}>«</a></li>
                      <li><a onClick={()=>{this.props.setOpenPONextPage()}}>»</a></li>
                      {pages}  
                    </ul>
                  </Col>
                </Row>


                    <ul className={pageClass}>
                      <li>
                        <Button  bsSize="large" bsStyle="info" onClick={()=>this.props.setState(STATE.NOT_STARTED)} >Back
                        </Button>
                      </li>
                      <li>
                      {"      "}
                      </li>
                      <li>
                      {"      "}
                      </li>
                      <li className={btnSpaceClass}>
                        <Button  bsSize="large" bsStyle="success" onClick={()=>this.props.OpenPOVendorEmailReport()} >Run
                        </Button>
                      </li>
                    </ul>


        <Button bsSize="xsmall">
          <Glyphicon glyph="chevron-down" />
        </Button>     


        <Panel style={{padding:0}} footer={test} collapsible expanded={this.state.open}>
          <OpenPOTable openPO={this.state.openPO} 
            toggleOpenPOSelected={this.state.toggleOpenPOSelected} 
            toggleOpenPOVisible={this.state.toggleOpenPOVisible}/>
        </Panel>

    var btnClass = classNames({
      'btn': true,
      'btn-pressed': this.state.isPressed,
      'btn-over': !this.state.isPressed && this.state.isHovered
    });
    return <button className={btnClass}>{this.props.label}</button>;
                    <ul className="pagination visible-xs pull-right">
                        <li><a href="#">«</a></li>
                        <li><a href="#">»</a></li>
                    </ul>

*/
