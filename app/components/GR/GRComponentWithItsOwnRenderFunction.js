//import React, { Component, PropTypes } from 'react';
import orb from 'orb';
import React, { Component, PropTypes } from 'react';

var data = require('./demo.data.js')

 var config = {
        dataSource: window.demo.data,
        canMoveFields: true, 
        dataHeadersLocation: 'columns',
        width: 1099,
        height: 611,
        theme: 'green',
        toolbar: {
            visible: true
        },
        grandTotal: {
            rowsvisible: false,
            columnsvisible: false
        },
        subTotal: {
            visible: true,
            collapsed: true,
            collapsible: true
        },
        rowSettings: {
            subTotal: {
                visible: true,
                collapsed: true,
                collapsible: true
            }
        },
        columnSettings: {
            subTotal: {
                visible: false,
                collapsed: true,
                collapsible: true
            }
        },
        fields: [
            {
                name: '6',
                caption: 'Amount',
                dataSettings: {
                    aggregateFunc: 'sum',
                    aggregateFuncName: 'whatever',
                    formatFunc: function(value) {
                        return value ? Number(value).toFixed(0) + ' $' : '';
                    }
                }
            },
            {
                name: '0',
                caption: 'Entity'
            },
            {
                name: '1',
                caption: 'Product',
            },
            {
                name: '2',
                caption: 'Manufacturer',
                sort: {
                    order: 'asc'
                },
                rowSettings: {
                    subTotal: {
                        visible: false,
                        collapsed: true,
                        collapsible: true
                    }
                },
            },
            {
                name: '3',
                caption: 'Class'
            },
            {
                name: '4',
                caption: 'Category',
                sort: {
                    order: 'desc'
                }
            },
            {
                name: '5',
                caption: 'Quantity',
                aggregateFunc: 'sum'
            }
        ],
        rows    : [ 'Manufacturer'],//, 'Category' ],
        columns : [ 'Class', 'Category' ],
        data    : [ 'Quantity', 'Amount' ],
        /*preFilters : {
            'Class': { 'Matches': 'Regular' },
            'Manufacturer': { 'Matches': /^a|^c/ },
            'Category'    : { 'Does Not Match': 'D' },
           // 'Amount'      : { '>':  40 },
         //   'Quantity'    : [4, 8, 12]
        }*/
    };

class GRPivot extends React.Component {
   componentDidMount() {
    this.ptable = new orb.pgridwidget(config);
//    this.ptable = new orb.pgridwidget(this.props.config);
    this.ptable.render(ReactDom.findDOMNode(this));
   }
   render() {
      return (<div></div>);
   }
}
export default GRPivot;