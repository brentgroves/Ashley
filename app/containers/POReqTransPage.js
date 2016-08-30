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
import POReqTrans from '../components/POReqTrans';
import * as POUpdateAppActions from '../actions/POUpdateApp';

function mapStateToProps(state) {
  return {
    	checks: state.checks
	};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POUpdateAppActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POReqTrans);