import React, { Component, PropTypes } from 'react';

var ReactPivot = require('../../react-pivot');
var rows = require('../../react-pivot/example/data.json')
export default class GRPivot extends React.Component{
  static propTypes = {
    GenR: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
//      updateChk1:this.props.updateChk1
    };
    // These are your "groups"
    // "title" is the title of the column
    // all rows with the same "value" will be grouped
    this.dimensions = [
      // "value" can be the key of what you want to group on
      {title: 'Last Name', value: 'lastName'},
      // "value" can also be function that returns what you want to group on
      {
        title: 'Transaction Type',
        value: function(row) { return row.transaction.type },
        template: function(value) {
          return '<a href="http://google.com/?q='+value+'">'+value+'</a>'
        }
      }
    ];





/*
	this.rows = [
	  {"firstName":"Francisco","lastName":"Brekke","state":"NY","transaction":{"amount":"399.73","date":"2012-02-02T08:00:00.000Z","business":"Kozey-Moore","name":"Checking Account 2297","type":"deposit","account":"82741327"}},
	  {"firstName":"Francisco","lastName":"Brekke","state":"NY","transaction":{"amount":"768.84","date":"2012-02-02T08:00:00.000Z","business":"Herman-Langworth","name":"Money Market Account 9344","type":"deposit","account":"95753704"}}
	];	
  
	this.calculations = [
	  {
	    title: 'Amount', value: 'amountTotal',
	    template: function(val, row) {
	      return '$' + val.toFixed(2)
	    }
	  }
	];
*/
// Calculations are columns for the "memo" object built up above
// "title" is the title of the column
this.calculations = [
  // "value" can be the key of the "memo" object from reduce
  // "template" changes the display of the value, but not sorting behavior
  {
    title: 'Amount', value: 'amountTotal',
    template: function(val, row) { return '$' + val.toFixed(2) }
  },
  {
    title: 'Avg Amount',
    // "value" can also be a function
    value: function(memo) { return memo.amountTotal / memo.count },
    template: function(val, row) { return '$' + val.toFixed(2) },
    // you can also give a column a custom class (e.g. right align for numbers)
    className: 'alignRight'
  }
];

    if ('development'==process.env.NODE_ENV) {
      console.log(`this.props.GenR.rcmast= `);
      console.dir(this.props.GenR.rcmast)
    }

  }





/*
	reduce(row, memo) {
	  memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row.transaction.amount)
	  return memo
	}
*/
// All rows will be run through the "reduce" function
// Use this to build up a "memo" object with properties you're interested in
reduce(row, memo) {
  // the memo object starts as {} for each group, build it up
  memo.count = (memo.count || 0) + 1
  memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row.transaction.amount)
  // be sure to return it when you're done for the next pass
  return memo
}


  render(){

    var whichTable;
        whichTable = 
  <ReactPivot rows={rows}
    dimensions={this.dimensions}
    reduce={this.reduce.bind(this)}
    calculations={this.calculations}
    activeDimensions={['Transaction Type']} />;  
          
    return ( <div>{whichTable}</div> );
  }

};

