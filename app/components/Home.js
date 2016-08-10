import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';


export default class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <div className="header-brand">
            <img src="../logodoc.bmp" height="35" />
            <p>Busche Production Software</p>
          </div>
        </header>
        <div className={styles.container}>
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link> 
          <br/>
          <Link to="/POUpdateApp">PO Update</Link>
        </div>
      </div>
    );
  }
}
