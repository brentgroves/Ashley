import React, { Component, PropTypes } from 'react';
import Griddle from 'griddle-react';
import POUpdateAPI from '../api/NoVenPoSql';
import { Link } from 'react-router';
import Select from 'react-select';

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

var LinkComponent = React.createClass({
  render: function(){
    return (
      <div>
        <Select
            name="form-field-name"
            value="one"
            options={options}
            onChange={logChange}
        />      
      </div>
    );
  }

//       <input type='text' onChange={this.filterText} onClick={this.textOnClick} />
 
/*
        <Select
            name="form-field-name"
            value="one"
            options={options}
            onChange={logChange}
        />      

      <select ref="userInput" defaultValue="" required>
      <option value="" disabled>User</option>
        {
          users.map(function(user) {
            return <option key={user.id}
              value={user.name}>{user.name}</option>;
          })
        }
     
      </select>

        <div>
        <option value="A">Apple</option>
        <option value="B">Banana</option>
        <option value="C">Cranberry</option>

<Link style={{color: 'red'}} to="/counter">to Counter</Link> 
        </div>

  render: function(){
 //   url ="speakers/" + this.props.rowData.PONumber;
    return  <Link to="/counter">to Counter</Link> 
  }
 */

});

var NoVenGriddle = React.createClass({
    getInitialState: function(){
      var initial = { "results": [],
          "currentPage": 0,
          "maxPages": 0,
          "externalResultsPerPage": 5,
          "externalSortColumn":null,
          "externalSortAscending":true,
          "results": []
      };

      return initial;
    },
    componentWillMount: function(){
    },
    componentDidMount: function(){
      this.getExternalData();
    },
    getExternalData: function(page){
      var that = this;
      page = page||1
      POUpdateAPI.noPOCategory.call(this);
//      poUpdate.call(that);
//      myPoUpdate();
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
      this.getExternalData(index);
    },
    setPageSize: function(size){
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
        "customHeaderComponent": HeaderComponent,
        "customHeaderComponentProps": { color: 'red' }
      },
      {
        "columnName": "UDF_POCATEGORY",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "PO Category",
        "customComponent": LinkComponent,
        "customComponentProps": { color: 'red' }
      }];
//        "columnName": "UDF_POCATEGORY",


      //columns={["name", "city", "state", "country"]}
      return <Griddle useExternal={true} externalSetPage={this.setPage} enableSort={false} 
        columnMetadata={columnMeta}
        columns={["PONumber","Item","UDF_POCATEGORY"]}
 //       columns={["name", "model", "manufacturer", "passengers"]}
        externalSetPageSize={this.setPageSize} externalMaxPage={this.state.maxPages}
        externalChangeSort={function(){}} externalSetFilter={function(){}}
        externalCurrentPage={this.state.currentPage} results={this.state.results} tableClassName="table" resultsPerPage={this.state.externalResultsPerPage}
        externalSortColumn={this.state.externalSortColumn} externalSortAscending={this.state.externalSortAscending} />
    }
});

export default NoVenGriddle;

/*
        externalSetPage={this.setPage}
        externalChangeSort={this.changeSort} externalSetFilter={this.setFilter}
        externalSetPageSize={this.setPageSize} externalMaxPage={this.state.maxPages}
        externalCurrentPage={this.state.currentPage} results={this.state.results} 
        tableClassName="table" resultsPerPage={this.state.externalResultsPerPage}
        getExternalData= {this.getExternalData}
        recordCnt={this.recordCnt}
        externalSortColumn={this.state.externalSortColumn} 
        externalSortAscending={this.state.externalSortAscending} 
*/