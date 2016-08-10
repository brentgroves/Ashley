import React, { Component, PropTypes } from 'react';
import styles from './POUpdateApp.css';
import { Link } from 'react-router';
import NoCatGriddle from './NoCatGriddle';
import POCategories from './POCategories';
import ReactGridLayout from  'react-grid-layout';
import Button from 'react-button';


function clicked(event){};

var POUpdateApp = React.createClass({

  render: function() {
    // layout is an array of objects, see the demo for more complete usage
    var layout = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'b', x: 1, y: 3, w: 10, h: 5, minW: 5, maxW: 10},
      {i: 'c', x: 4, y: 0, w: 1, h: 2}
    ];


    return (
      <ReactGridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
        <div key={'a'}>
           <div className={styles.backButton}>
              <Link to="/">
                <i className="fa fa-arrow-left fa-3x" />
              </Link>
            </div>
          </div>
        <div key={'b'}>
           <NoCatGriddle />
         </div>
      </ReactGridLayout>
    )
  }
});

export default POUpdateApp;