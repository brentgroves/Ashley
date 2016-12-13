//require('../../react-pivot/example/demo.css')
import React, { Component, PropTypes } from 'react';
var ReactPivot = require('react-pivot');
var _ = require('lodash');
var joins = require('lodash-joins');




export default class GRPivot extends React.Component{
  static propTypes = {
    GenR: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {

      rcvJoin:this.props.GenR.rcvJoin,
      showInput:false,
//      updateChk1:this.props.updateChk1
      dimensions : [
        {value: 'fpono', title: 'PO'},
        {value: 'fpartno', title: 'PN'}
      ],

      calculations : [
      /*
        {
          title: 'PN',
          value: 'fpartno',
          className: 'alignRight'
        },
        {
          title: 'Packing',
          value: 'fpacklist',
          className: 'alignRight'
        },
        {
          title: 'Carrier',
          value: 'ffrtcarr',
          className: 'alignRight'
        },
        {
          title: 'Qty',
          value: 'fqtyrecv',
          className: 'alignRight'
        },
        {
          title: 'Cost',
          value: 'fucost',
          className: 'alignRight'
        },

        {
          title: 'Amount',
          value: 'amountTotal',
          template: function(val, row) {
            return '$' + val.toFixed(2)
          },
          className: 'alignRight'
        }
*/
        {
          title: 'Receiver',
          value: 'rcv',
          className: 'alignRight'
        },
        {
          title: 'Packing',
          value: 'plist',
          className: 'alignRight'
        },
        {
          title: 'Carrier',
          value: 'car',
          className: 'alignRight'
        },
        {
          title: 'Qty',
          value: 'qty',
          className: 'alignRight'
        },
        {
          title: 'Amount',
          value: 'amountTotal',
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

  // All rows will be run through the "reduce" function
  // Use this to build up a "memo" object with properties you're interested in
  reduce(row, memo) {
    if ('development'==process.env.NODE_ENV) {
      console.log(`row= ${row}`);
      console.dir(row);
      console.log(`memo= ${memo}`);
      console.dir(memo);
    }

    // the memo object starts as {} for each group, build it up
    memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row.fqtyrecv)
    // be sure to return it when you're done for the next pass
    if(memo._level==0){
      memo.plist = ' ';
      memo.car = ' ';
      memo.qty = ' '; 
      memo.rcv = ' ';
    }else{
      memo.plist = row.fpacklist;
      memo.car = row.ffrtcarr;
      memo.qty = row.fqtyrecv; 
      memo.rcv = row.freceiver;

    }
    return memo
  }



  render(){

    var whichTable;
        whichTable = 
          <ReactPivot rows={this.state.rcvJoin}
                      dimensions={this.state.dimensions}
                      calculations={this.state.calculations}
                      reduce={this.reduce.bind(this)}
                      activeDimensions={['PO','Receiver']}

                      nPaginateRows={8} />
 
    return ( <div> {whichTable}</div>);
  }

};

