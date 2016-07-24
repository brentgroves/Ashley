import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './NoVenPoList.css';
import SimulatedExternalComponent from './SimulatedExternalComponent';

var Griddle = require('griddle-react');
//equire('react-datagrid/index.css');
//var DataGrid = require('react-datagrid');
//const {Table, Column, Cell} = require('fixed-data-table');


class NoVenPoList extends Component {
  /*
  static propTypes = {
    noVenPoList: PropTypes.array.isRequired
  };
*/

    render() {
      const { noVenPoList } = this.props;
 
      return (
          <div>
            <div className={styles.backButton}>
              <Link to="/">
                <i className="fa fa-arrow-left fa-3x" />
              </Link>
            </div>
            <div className={`noVenPoList ${styles.noVenPoList}`}>
              <SimulatedExternalComponent />
            </div>
          </div>        
      );
    }
 };
    
/*
  render() {
    const { getNoVenPoList,noVenPoList } = this.props;


    var headerComponents = this.generateHeaders(),
        rowComponents = this.generateRows(noVenPoList);

  // Table data as a list of array.
    const rows = [
      ['a1', 'b1', 'c1'],
      ['a2', 'b2', 'c2'],
      ['a3', 'b3', 'c3'],
      // .... and more
    ];

    return (
      <Table
        rowHeight={50}
        rowsCount={rows.length}
        width={100}
        height={100}
        headerHeight={50}>
        <Column
          header={<Cell>Col 1</Cell>}
          cell={<Cell>Column 1 static content</Cell>}
          width={30}
        />
        <Column
          header={<Cell>Col 2</Cell>}
          cell={<Cell>Column 2 static content</Cell>}
          width={30}
        />
        <Column
          header={<Cell>Col 3</Cell>}
          cell={<Cell>Column 3 static content</Cell>}
          width={30}
        />
      </Table>
    );
  };

  generateHeaders() {
    var cols = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' }
    ];

    // generate our header (th) cell components
    return cols.map(function(colData) {
        return <th key={colData.key}> {colData.label} </th>;
    });
  };

  generateRows(po) {
    var cols = [
        { id:1, key: 'firstName', label: 'First Name' },
        { id:2, key: 'lastName', label: 'Last Name' }
    ];

//    var cols = [
//        { key: 'PONumber', label: 'PO' },
//        { key: 'Vendor', label: 'Vendor' },
//        { key: 'Address1', label: 'Address'}
//    ];

    var data = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Clark', lastName: 'Kent' }
    ];

    return data.map(function(item) {
        var colKey=0;
        // handle the column data within each row
        var cells = cols.map(function(colData) {
            colKey=colKey+1;
            // colData.key might be "firstName"
            return <td key={colKey}> {item[colData.key]} </td>;
        });
        return <tr key={item.id}> {cells} </tr>;
    });
  };
}
*/
export default NoVenPoList;
