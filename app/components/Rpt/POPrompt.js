//require('../../react-pivot/example/demo.css')
import React, { Component, PropTypes } from 'react';
import { Table,Button,Glyphicon,ButtonGroup,ButtonToolbar} from 'react-bootstrap';


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
      toggleOpenPOSelected: this.props.toggleOpenPOSelected.bind(this),
      toggleOpenPOVisible: this.props.toggleOpenPOVisible.bind(this),
      poItem:this.props.poItem
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
    var fpono=this.state.poItem.fpono;
    if ('development'==process.env.NODE_ENV) {
      console.log(`PORow:fpono=>${fpono}`);
    }
    var checkbox;
    checkbox=<input type="checkbox" onChange={()=>this.state.toggleOpenPOSelected(fpono)}/>     
    var showButton;
    if(this.state.poItem.visible){
      showButton=
        <Button bsSize="xsmall" 
          onClick={()=>this.state.toggleOpenPOVisible(fpono)}>
          <Glyphicon glyph="chevron-down" />
        </Button>     
    }else{
      showButton=
        <Button bsSize="xsmall" 
          onClick={()=>this.state.toggleOpenPOVisible(fpono)}>
          <Glyphicon glyph="chevron-right" />
        </Button>     
    }
    return (
      <tr style={{}}>
        <th >
          {showButton}
        </th>
        <th>
          {fpono}
        </th>
        <th>
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
      poItem:this.props.poItem
    };
  }
  render() {
    var myRow=null;
    var fpono=this.state.poItem.fpono;
    var fpartno=this.state.poItem.fpartno;
    var fordqty=this.state.poItem.fordqty;
    var frcvqty=this.state.poItem.frcvqty;
    if(true==this.state.poItem.visible){
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

class OpenPOTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPO: this.props.openPO,
      toggleOpenPOSelected: this.props.toggleOpenPOSelected.bind(this),
      toggleOpenPOVisible: this.props.toggleOpenPOVisible.bind(this)
    };
    if ('development'==process.env.NODE_ENV) {
      console.log(`OpenPO:this.props.toggleOpenPOSelected=>`);
      console.dir(this.props.toggleOpenPOSelected);
    }
  }
  render() {
    var rows = [];
    var lastPO = null;
    if ('development'==process.env.NODE_ENV) {
      console.log(`OpenPOTable.render()=>`);
    }
    var toggleOpenPOSelected= this.state.toggleOpenPOSelected.bind(this);
    var toggleOpenPOVisible=this.state.toggleOpenPOVisible.bind(this);
    this.state.openPO.forEach(function(poItem) {
      if (poItem.fpono !== lastPO) {
        if ('development'==process.env.NODE_ENV) {
          console.log(`poItem.fpono=>${poItem.fpono}`);
          console.log(`lastPO=>${lastPO}`);
          console.log(`poItem.fpono !== lastPO`);
        }
        rows.push(<PORow 
                    toggleOpenPOSelected={toggleOpenPOSelected} 
                    toggleOpenPOVisible={toggleOpenPOVisible}
                    poItem={poItem} key={poItem.fpono} />);
      }else{
        if ('development'==process.env.NODE_ENV) {
          console.log(`poItem.fpono=>${poItem.fpono}`);
          console.log(`lastPO=>${lastPO}`);
          console.log(`poItem.fpono === lastPO`);
        }

      }
      var key = poItem.fpono+poItem.fpartno
      rows.push(<POItemRow poItem={poItem} key={key} />);
      lastPO = poItem.fpono;
    });
    return (
      <Table striped bordered condensed hover>
        <caption>PO(s) Notifications</caption>
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
      openPO:this.props.Rpt.openPO,      
      toggleOpenPOSelected: this.props.toggleOpenPOSelected.bind(this),
      toggleOpenPOVisible: this.props.toggleOpenPOVisible.bind(this)
    };
    if ('development'==process.env.NODE_ENV) {
      console.log(`POPrompt:this.props.toggleOpenPOSelected=>`);
      console.dir(this.props.toggleOpenPOSelected);
    }
  }
 

  render() {
    
     if ('development'==process.env.NODE_ENV) {
     // console.log(`this.state.setStyle=>`);
     // console.dir(this.state.setStyle);
    }
    return (
      <div>
        <SearchBar />
        <OpenPOTable openPO={this.state.openPO} 
          toggleOpenPOSelected={this.state.toggleOpenPOSelected} 
          toggleOpenPOVisible={this.state.toggleOpenPOVisible}/>
      </div>
    );
  }
}


