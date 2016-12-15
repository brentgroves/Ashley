//require('../../react-pivot/example/demo.css')
import React, { Component, PropTypes } from 'react';
import ReactDataGrid from 'react-datagrid';
require('../../dg.global.css')
var sorty    = require('sorty')
var _ = require('lodash');
var joins = require('lodash-joins');

var rowIndex=0;

export default class GRReactDataGrid extends React.Component{
  static propTypes = {
    GenR: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      rcvJoin:this.props.GenR.rcvJoin,
      columns : [
        { name: 'identity_column'},
        { name: 'freceiver'},
        { name: 'fpono'},
        { name: 'fpartno'}
      ],
      SORT_INFO: [ { name: 'fpartno', dir: 'asc'}],
      sort:this.sort.bind(this) ,
      rowIndex:0    
    };

    if ('development'==process.env.NODE_ENV) {
//      console.log(`this.test = `);
  //    console.dir(this.test);
    }

  }
  handleSortChange(sortInfo){
    if ('development'==process.env.NODE_ENV) {
      console.log(`this = `);
      console.dir(this);
    }

    this.state.SORT_INFO = sortInfo
    this.props.GenR.rcvJoin = this.state.sort(this.props.GenR.rcvJoin);

    this.setState({})
  }
  handleColumnOrderChange(index, dropIndex){
    var col = columns[index]
    this.state.columns.splice(index, 1) //delete from index, 1 item
    this.state.columns.splice(dropIndex, 0, col)
    this.setState({})
  }
  rowStyle(data, props){
    if ('development'==process.env.NODE_ENV) {
      console.log(`data = `);
      console.dir(data);
      console.log(`props = `);
      console.dir(props);
      console.log(`rowIndex =${rowIndex}`);
    }
    var style = {}
    rowIndex++;
    if (rowIndex % 1 == 0){
      style.background = '#2C3446';
      style.color='green';
   //   style.color= 'white';
    }else{
      style.background= 'green';
      style.color='#2C3446';

    }
/*
    if (data.country == 'USA'){
      style.background = '#FFD3D3'
      style.fontWeight = 'bold'
    }
*/
    return style
  }

  sort(arr){
    return sorty(this.state.SORT_INFO, arr)
  }
  render(){
    var whichTable;
        whichTable = 
        <ReactDataGrid idProperty="identity_column" 
        dataSource={this.props.GenR.rcvJoin} 
        style={{height: 350}}
//        sortInfo={this.state.SORT_INFO}
//        onSortChange={this.handleSortChange.bind(this)}
        rowStyle={this.rowStyle.bind(this)}
        groupBy={['fpono','fpartno']}
        columns={this.state.columns} />   
     return ( <div> {whichTable}</div>);
  }

};

