import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './PO.css';

class PO extends Component {
  static propTypes = {
    po: PropTypes.number.isRequired
  };

  render() {
    const { retrievePO, po } = this.props;
    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`po ${styles.po}`}>
          {po}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={retrievePO}>
            <i className="fa fa-plus"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default PO;
