import React, { Component, PropTypes } from 'react';
import Griddle from 'griddle-react';

var fakeData =  [
  {
    "id": 0,
    "name": "Mayer Leonard",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 2,
    "name": "Mayer Leonard 2",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 3,
    "name": "Mayer Leonard 3",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 0,
    "name": "Mayer Leonard",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 2,
    "name": "Mayer Leonard 2",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 3,
    "name": "Mayer Leonard 3",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 0,
    "name": "Mayer Leonard",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 2,
    "name": "Mayer Leonard 2",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 3,
    "name": "Mayer Leonard 3",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 0,
    "name": "Mayer Leonard",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 2,
    "name": "Mayer Leonard 2",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 3,
    "name": "Mayer Leonard 3",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  }
];

var externalData = fakeData.slice(0, 53);
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

      swapiModule.getStarships(page, function(data) {
       that.setState({
          results: data.results,
          currentPage: page-1,
          maxPages: Math.round(data.count/10)
        })
      });
    },    
    setPage: function(index){
      //This should interact with the data source to get the page at the given index
      index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
      this.getExternalData(index);
    },
    setPageSize: function(size){
    },
    render: function(){
      //columns={["name", "city", "state", "country"]}
      return <Griddle useExternal={true} externalSetPage={this.setPage} enableSort={false} 
        columns={["name", "model", "manufacturer", "passengers"]}
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