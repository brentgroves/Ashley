import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
//import styles from './NoCatList.css';
import NoCatGriddle from './NoCatGriddle';
import POCategories from './POCategories';
var Button = require('react-button');
var ReactGridLayout = require('react-grid-layout');
import MyFirstGrid from './MyFirstGrid';

//var Griddle = require('griddle-react');
//equire('react-datagrid/index.css');
//var DataGrid = require('react-datagrid');
//const {Table, Column, Cell} = require('fixed-data-table');


class NoCatList extends Component {
  /*
  static propTypes = {
    noVenPoList: PropTypes.array.isRequired
  };
  <SimulatedExternalComponent />
*/
    clicked(event){
      console.log('been clicked');
    };

    render() {
      const { noCatList } = this.props;
 
      return (
        <MyFirstGrid />
      );
    }
 };
    
/*
            <div className={styles.backButton}>
              <Link to="/">
                <i className="fa fa-arrow-left fa-3x" />
              </Link>
            </div>

            <div className={styles.noCatList}>
                 <NoCatGriddle />
            </div>

                <Select.Async multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="UDF_POCATEGORY" labelKey="descr" loadOptions={this.getUsers} minimumInput={1} backspaceRemoves={false} />

              <NumericSelect label="Numeric Values" />
               <GithubUsers label="Github users (Async with fetch.js)" />

                <POCategories />

               <GithubUsers label="Github users (Async with fetch.js)" />


              <NoVenGriddle />
*/
export default NoCatList;
