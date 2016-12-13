//require('../../react-pivot/example/demo.css')
import React, { Component, PropTypes } from 'react';
var ReactPivot = require('react-pivot');
var data = require('react-pivot/example/data.json');
//var ReactPivot = require('../../react-pivot');
//var gh = require('../../react-pivot/example/gh.jsx')
//var data = require('../../react-pivot/example/data.json')

/*
              include: function(absPath) {
              if(absPath.indexOf('/node_modules/orb/') > -1) {
                return true;
              } else {
                   return false;
              }
  
*/

export default class GRPivot extends React.Component{
  static propTypes = {
    GenR: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showInput:false,
//      updateChk1:this.props.updateChk1
      dimensions : [
        {value: 'firstName', title: 'First Name'},
        {value: 'lastName', title: 'Last Name'},
        {value: 'state', title: 'State'},
        {value: function(row) {
          return row.transaction.business
        }, title: 'Business'},
        {value: function(row) {
          return row.transaction.type
        }, title: 'Transaction Type'}
      ],

      calculations : [
        {
          title: 'Count',
          value: 'count',
          className: 'alignRight'
        },
        {
          title: 'Amount',
          value: 'amountTotal',
          template: function(val, row) {
            return '$' + val.toFixed(2)
          },
          className: 'alignRight'
        },
        {
          title: 'Avg Amount',
          value: function(row) {
            return row.amountTotal / row.count
          },
          template: function(val, row) {
            return '$' + val.toFixed(2)
          },
          className: 'alignRight'
        }
      ]
    };

    if ('development'==process.env.NODE_ENV) {
      console.log(`this.props.GenR.rcmast= `);
      console.dir(this.props.GenR.rcmast)
    }

  }

  toggleShow() {
    var showInput = this.state.showInput
    this.setState({showInput: !this.state.showInput})
  }


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
          <ReactPivot rows={data}
                      dimensions={this.state.dimensions}
                      calculations={this.state.calculations}
                      reduce={this.reduce.bind(this)}
                      activeDimensions={['Transaction Type']}
                      nPaginateRows={5} />
 
    return ( <div> {whichTable}</div>);
  }

};

/*
  <ReactPivot rows={rows}
    dimensions={this.dimensions}
    reduce={this.reduce.bind(this)}
    calculations={this.calculations}
    activeDimensions={['Transaction Type']} />;  

      <div className='demo'>
        <h1>ReactPivot</h1>

        <p>
          ReactPivot is a data-grid component with pivot-table-like functionality.
        </p>

        <p>
          Muggles will love you.
        </p>

        <p>
          <a href='https://github.com/davidguttman/react-pivot'>
            View project and docs on Github
          </a>
        </p>

       <div className={this.state.showInput ? 'hide' : ''}>
          <ReactPivot rows={data}
                      dimensions={this.state.dimensions}
                      calculations={this.state.calculations}
                      reduce={this.reduce.bind(this)}
                      activeDimensions={['Transaction Type']}
                      nPaginateRows={20} />
        </div>

        <div className={this.state.showInput ? '' : 'hide'}>
          <textarea
            value={JSON.stringify(data, null, 2)}
            readOnly={true} />
        </div>

        <p>
          <a className={this.state.showInput ? '' : 'strong'}
             onClick={this.toggleShow.bind(this)}>Grid View</a>
          {' | '}
          <a className={this.state.showInput ? 'strong' : ''}
             onClick={this.toggleShow.bind(this)}>Input Data</a>
        </p>

        {gh}

         </div>
      
*/