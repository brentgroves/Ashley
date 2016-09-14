/*
import React, { Component } from 'react';
import POReqTrans from '../components/POReqTrans';

export default class POReqTransPage extends Component {
  render() {
    return (
      <POReqTrans />
    );
  }
}
*/


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import POReqTransChecks from '../components/POReqTransChecks';
import * as POReqTrans from '../actions/POReqTrans';

function mapStateToProps(state) {
  return {
    	POReqTrans: state.POReqTrans
	};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POReqTrans, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POReqTransChecks);