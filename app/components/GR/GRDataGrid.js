//require('../../react-pivot/example/demo.css')
import React, { Component, PropTypes } from 'react';
import ReactDataGrid from 'react-data-grid';
// If you want to use extra features such as built in editors, 
//formatters, toolbars and other plugins, you need to require the addons module as well
var ReactDataGridPlugins = require('react-data-grid/addons');
//import Test  from 'react-data-grid/addons/Editors';
//import { Editors ,Toolbar, Data,GroupedColumnsPanel, DraggableContainer} from 'react-data-grid/addons';
var _ = require('lodash');
var joins = require('lodash-joins');
//const Selectors = Data.Selectors;

    var Editors             = ReactDataGridPlugins.Editors;
    var Toolbar             = ReactDataGridPlugins.ToolsPanel.AdvancedToolbar;
    var Selectors = ReactDataGridPlugins.Data.Selectors;
    var GroupedColumnsPanel = ReactDataGridPlugins.ToolsPanel.GroupedColumnsPanel;
    var DraggableContainer = ReactDataGridPlugins.Draggable.Container;


 var CustomToolbar = React.createClass({
   render() {
     return (<Toolbar>
       <GroupedColumnsPanel groupBy={this.props.groupBy} onColumnGroupAdded={this.props.onColumnGroupAdded} onColumnGroupDeleted={this.props.onColumnGroupDeleted}/>
       </Toolbar>);
   }
 });

/*
 var CustomToolbar = React.createClass({
  getInitialState : function(){
    var Selectors = ReactDataGridPlugins.Data.Selectors;
    return {rows :Selectors};
  },

   render() {
     return (<div></div>);
   }
 });
class GRTest extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      columns : [
      {
        key: 'freceiver',
        name: 'Receiver',
        locked : true
      },
      {
        key: 'fpono',
        name: 'PO',
        width: 200
      },
      {
        key: 'fpartno',
        name: 'PN',
        width: 200
      }],
      expandedRows: {},
      groupBy: []      
    };

    if ('development'==process.env.NODE_ENV) {
      console.log(`this.test = `);
      console.dir(this.test);
      console.log(`this.Selectors = `);
      console.dir(this.Selectors);
    }

  }

  //function to retrieve a row for a given index
  rowGetter(i){
    return this.state.rcvJoin[i];
  };


  render(){
    var whichTable;
        whichTable = 
        <Toolbar>
//       <GroupedColumnsPanel groupBy={this.props.groupBy} onColumnGroupAdded={this.props.onColumnGroupAdded} onColumnGroupDeleted={this.props.onColumnGroupDeleted}/>
       </Toolbar>;


 
    return ( <div> {whichTable}</div>);
  }

};

*/
export default class GRDataGrid extends React.Component{
  static propTypes = {
    GenR: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.test = ReactDataGrid;
    this.Selectors = ReactDataGridPlugins;

    this.state = {
      rcvJoin:this.props.GenR.rcvJoin,
      columns : [
      {
        key: 'freceiver',
        name: 'Receiver',
        locked : true
      },
      {
        key: 'fpono',
        name: 'PO',
        width: 200
      },
      {
        key: 'fpartno',
        name: 'PN',
        width: 200
      }],
      expandedRows: {},
      groupBy: []      
    };

    if ('development'==process.env.NODE_ENV) {
      console.log(`this.test = `);
      console.dir(this.test);
      console.log(`this.Selectors = `);
      console.dir(this.Selectors);
    }

  }

  //function to retrieve a row for a given index
  rowGetter(i){
    return this.state.rcvJoin[i];
  };
  onRowExpandToggle(args){
    var expandedRows = Object.assign({}, this.state.expandedRows);
    expandedRows[args.columnGroupName] = Object.assign({}, expandedRows[args.columnGroupName]);
    expandedRows[args.columnGroupName][args.name] = {isExpanded: args.shouldExpand};
    this.setState({expandedRows: expandedRows});
  };

  onColumnGroupAdded(colName) {
    var columnGroups = this.state.groupBy.slice(0);
    if(columnGroups.indexOf(colName) === -1) {
      columnGroups.push(colName);
    }
    this.setState({groupBy: columnGroups});
  };
    
  onColumnGroupDeleted(name) {
    var columnGroups = this.state.groupBy.filter(function(g){return g !== name});
    this.setState({groupBy: columnGroups});
  };
    
/*

          <ReactDataGrid
  columns={this.state.columns}
  rowGetter={this.rowGetter.bind(this)}
  rowsCount={this.state.rcvJoin.length}
  minHeight={300} />

*/


  render(){
/*
    var Editors             = ReactDataGridPlugins.Editors;
    var Toolbar             = ReactDataGridPlugins.ToolsPanel.AdvancedToolbar;
    var Selectors = ReactDataGridPlugins.Data.Selectors;
    var GroupedColumnsPanel = ReactDataGridPlugins.ToolsPanel.GroupedColumnsPanel;
    var DraggableContainer = ReactDataGridPlugins.Draggable.Container;
        <DraggableContainer>
            <ReactDataGrid
              ref='grid'
              enableCellSelect={true}
              enableDragAndDrop={true}
              columns={this.state.columns}
              rowGetter={this.rowGetter.bind(this)}
              rowsCount={this.state.rcvJoin.length}
              onRowExpandToggle={this.onRowExpandToggle}
              toolbar={<CustomToolbar groupBy={this.state.groupBy} onColumnGroupAdded={this.onColumnGroupAdded} onColumnGroupDeleted={this.onColumnGroupDeleted}/>}
              rowHeight={50}
              minHeight={600}
              />
        </DraggableContainer>

*/
/*
    var whichTable;
        whichTable = 
          <ReactDataGrid
  columns={this.state.columns}
  rowGetter={this.rowGetter.bind(this)}
  rowsCount={this.state.rcvJoin.length}
  minHeight={300} />;

*/
     var whichTable;
        whichTable = 
        <DraggableContainer>
            <ReactDataGrid
              ref='grid'
              enableCellSelect={true}
              enableDragAndDrop={true}
              columns={this.state.columns}
              rowGetter={this.rowGetter.bind(this)}
              rowsCount={this.state.rcvJoin.length}
              onRowExpandToggle={this.onRowExpandToggle}
              toolbar={<CustomToolbar groupBy={this.state.groupBy} onColumnGroupAdded={this.onColumnGroupAdded} onColumnGroupDeleted={this.onColumnGroupDeleted}/>}
              rowHeight={50}
              minHeight={600}
              />
        </DraggableContainer>

    return ( <div> {whichTable}</div>);
  }

};

