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
import * as POReqActions from '../actions/POReqTrans';

function mapStateToProps(state) {
  return {
    	POReqTrans: state.POReqTrans
	};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POReqActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POReqTrans);