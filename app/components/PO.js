import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './PO.css';

class PO extends Component {
  static propTypes = {
    po: PropTypes.array.isRequired
  };

//       <div className={`po ${styles.po}`}>
  render() {

   const { retrievePO,po } = this.props;

    var headerComponents = this.generateHeaders(),
        rowComponents = this.generateRows(po);

    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
       <div className={`po ${styles.po}`}>
        {po[0].PONumber}
          <table>
              <thead> {headerComponents} </thead>
              <tbody> {rowComponents} </tbody>
          </table>
        </div>
        <div className={styles.btnGroup}>
           <button className={styles.btn} onClick={retrievePO}>
            <i className="fa fa-plus"></i>
          </button>
        </div>

      </div>
    );
  };

  generateHeaders() {
    var cols = [
        { key: 'po', label: 'PO' },
        { key: 'vn', label: 'Vendor' }
    ];

    // generate our header (th) cell components
    return cols.map(function(colData) {
        return <th key={colData.key}> {colData.label} </th>;
    });
  };

  generateRows(po) {
    var cols = [
        { key: 'PONumber', label: 'First Name' },
        { key: 'VendorPO', label: 'Last Name' }
    ];

    var data = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Clark', lastName: 'Kent' }
    ];

    return po.map(function(item) {
        // handle the column data within each row
        var cells = cols.map(function(colData) {

            // colData.key might be "firstName"
            return <td> {item[colData.key]} </td>;
        });
        return <tr key={item.PONumber}> {cells} </tr>;
    });
  };
}

export default PO;
