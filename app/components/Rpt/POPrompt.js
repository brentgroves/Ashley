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
    var fpono=this.props.poItem.fpono;
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORow:fpono=>${fpono}`);
    }
    var checkbox;
    checkbox=<input type="checkbox" onChange={()=>this.props.toggleOpenPOSelected(fpono)}/>;     
    var showButton;
    if(this.props.poItem.visible){
      showButton=
        <Button bsSize="xsmall" 
          onClick={()=>this.props.toggleOpenPOVisible(fpono)}>
          <Glyphicon glyph="chevron-down" />
        </Button>     
    }else{
      showButton=
        <Button bsSize="xsmall" 
          onClick={()=>this.props.toggleOpenPOVisible(fpono)}>
          <Glyphicon glyph="chevron-right" />
        </Button>     
    }
    return (
      <tr >
        <th colSpan="4" >
          {showButton}
          <span style={{paddingLeft:25,color:'steelblue'}}>PO: </span> 
          {fpono}
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
    var fpono=this.props.poItem.fpono;
    var fpartno=this.props.poItem.fpartno;
    var fordqty=this.props.poItem.fordqty;
    var frcvqty=this.props.poItem.frcvqty;
    if(true==this.props.poItem.visible){
      myRow=<tr>
            <td>{fpono}</td>
            <td>{fpartno}</td>
            <td>{fordqty}</td>
            <td>{frcvqty}</td>
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
      if (poItem.fpono !== lastPO) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`poItem.fpono=>${poItem.fpono}`);
          console.log(`lastPO=>${lastPO}`);
          console.log(`poItem.fpono !== lastPO`);
        }
        if(curPage==poItem.page){
          rows.push(<PORow 
                      toggleOpenPOSelected={toggleOpenPOSelected} 
                      toggleOpenPOVisible={toggleOpenPOVisible}
                      poItem={poItem} key={poItem.fpono} />);          
        }

      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`poItem.fpono=>${poItem.fpono}`);
          console.log(`lastPO=>${lastPO}`);
          console.log(`poItem.fpono === lastPO`);
        }

      }
      var key = poItem.fpono+poItem.fpartno
      if(curPage==poItem.page){
        rows.push(<POItemRow poItem={poItem} key={key} />);
      }
      lastPO = poItem.fpono;
    });
    return (
      <Table style={{marginTop:0,marginBottom:0}} fill striped bordered condensed >
        <thead>
          <tr className={styles.tableHeader}>
            <th>PO</th>
            <th>Part#</th>
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
      setState:this.props.setState(STATE.NOT_STARTED).bind(this),
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
    
     if ('development'==process.env.NODE_ENV) {
      console.log(`POPrompt.Render().this.props.Rpt.openPO.curPage=>${this.props.Rpt.openPO.curPage}`);

    }
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
    var pages = [];
    var poItem=this.props.Rpt.openPO.poItem;
    var curPage=this.props.Rpt.openPO.curPage;
    var maxPage=this.props.Rpt.openPO.maxPage;
    var prevPage,nextPage;
    if (maxPage>=curPage){
      nextPage=curPage;
    }else{
      nextPage+=curPage
    }
    if(1>=curPage){
      prevPage=1;
    }else{
      prevPage-=1;
    }
    var maxPage=this.props.Rpt.openPO.maxPage;
    for(var x=1;x<=maxPage;x++){
        let page=x;
        pages.push(<li><a onClick={()=>{this.props.setOpenPOCurPage(page)}}>{x}</a></li>);
    }

    return (
      <div>
          <OpenPOTable poItem={poItem} curPage={curPage}
            toggleOpenPOSelected={this.props.toggleOpenPOSelected} 
            toggleOpenPOVisible={this.props.toggleOpenPOVisible}/>
                <Row>
                  <Col xs={2}>
                    <ul className={pageNoClass}>
                      <li><span style={{color:'black'}} >Page {curPage} of {maxPage}</span></li>
                    </ul>
                  </Col>
                  <Col xs={4}>
                    <ul className={pageClass}>
                      <li>
                        <Button  bsSize="large" bsStyle="info" onClick={()=>this.props.setState(STATE.NOT_STARTED)} >Back
                        </Button>
                      </li>
                    </ul>
                  </Col>
                   <Col xs={6}>
                    <ul className={pageClass}>
                      <li><a onClick={()=>{this.props.setOpenPOCurPage(prevPage)}}>«</a></li>
                      <li><a onClick={()=>{this.props.setOpenPOCurPage(nextPage)}}>»</a></li>
                      {pages}  
                    </ul>
                  </Col>
                </Row>

      </div>
    );
  }
}


/*

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
