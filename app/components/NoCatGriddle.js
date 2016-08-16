import React, { Component, PropTypes } from 'react';
import Griddle from 'griddle-react';
import POUpdateAPI from '../api/POUpdate';
import { Link } from 'react-router';
import Select from 'react-select';
//import POCategories from './POCategories';
import Button from 'react-button';
import POCategoriesPage from '../containers/POCategoriesPage';
//import GithubUsers from './GithubUsers';

var HeaderComponent = React.createClass({
  textOnClick: function(e) {
    e.stopPropagation();
  },

  filterText: function(e) {
    this.props.filterByColumn(e.target.value, this.props.columnName)
  },

  render: function(){
    return (
      <span>
        <div><strong style={{color: this.props.color}}>{this.props.displayName}</strong></div>
        <input type='text' onChange={this.filterText} onClick={this.textOnClick} />
      </span>
    );
  }
});


var users = [{id:1,name:'ven1'},{id:2,name:'ven2'},{id:3,name:'ven3'}];
var options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    { value: 'three', label: 'Three' }
];


function logChange(val) {
    console.log("Selected: " + val);
}


function clicked(event){
    console.log('handleClick');

};

var NoCatGriddle = React.createClass({
    propTypes: {
        getNoCatList: PropTypes.func.isRequired,
        setNoCatList: PropTypes.func.isRequired,
        fetchNoCatList: PropTypes.func.isRequired,
        noCatList: PropTypes.array.isRequired
    },

    getInitialState: function(){
      var initial = { "results": this.props.noCatList,
          "currentPage": 0,
          "maxPages": 0
      };

      return initial;
    },
    componentWillMount: function(){
    },
    componentDidMount: function(){
      var that=this;
//      this.getExternalData();
    },
    getExternalData: function(page){
      var that = this;
      page = page||1
      POUpdateAPI.noPOCategory.call(this);
/*
      msSqlModule.getStarships(page, function(data) {
       that.setState({
          results: data.results,
          currentPage: page-1,
          maxPages: Math.round(data.count/10)
        })
      });
      */
    },    
    setPage: function(index){
      //This should interact with the data source to get the page at the given index
      index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
 //     this.getExternalData(index);
    },
    setPageSize: function(size){
    },
  handleClick: function(event) {
    this.props.getNoCatList();
    console.log('handleClick');
  },

    render: function(){
      var columnMeta = [
      {
        "columnName": "PONumber",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "PO Number"
      },
      {
        "columnName": "Item",
        "order": 2,
        "customHeaderComponent": HeaderComponent,
        "customHeaderComponentProps": { color: 'red' }
      },
      {
        "columnName": "UDF_POCATEGORY",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "PO Category",
        "customComponent": POCategoriesPage,
        "customComponentProps": { color: 'red' }
      },
      {
        "columnName": "dirty",
        "order": 4,
        "locked": false,
        "visible": true,
        "displayName": "dirty"
      }];
//        "columnName": "UDF_POCATEGORY",

      var divStyle = {
          margin: 'auto',
          width: '10%',
          padding: '10px'
      };

      var boundClick = this.handleClick;
      return (

        <div>
          <Griddle results={this.props.noCatList} 
            tableClassName="table" showFilter={true}
            columnMetadata={columnMeta}
            columns={["PONumber","Item","UDF_POCATEGORY","dirty"]}
            showSettings={true} 
          />

          <br/>
          <div style={divStyle}>
          <Button className="ui button" onClick={boundClick}>Save Updates</Button>
          </div>
          </div>
        );

    }
});

/*
        <Griddle useExternal={true} externalSetPage={this.setPage} enableSort={false} 
        columnMetadata={columnMeta}
        columns={["PONumber","Item","UDF_POCATEGORY"]}
        externalSetPageSize={this.setPageSize} externalMaxPage={this.state.maxPages}
        externalChangeSort={function(){}} externalSetFilter={function(){}}
        externalCurrentPage={this.state.currentPage} results={this.state.results} tableClassName="table" resultsPerPage={this.state.externalResultsPerPage}
        externalSortColumn={this.state.externalSortColumn} 
        externalSortAscending={this.state.externalSortAscending} 
        />
 
*/
export default NoCatGriddle;

