import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as GRActions from '../actions/GRActions';

function mapStateToProps(state) {
  return {
    	GenR: state.GenReceivers
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GRActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);


/*
import React, { Component } from 'react';
import Home from '../components/Home';

export default class HomePage extends Component {
  render() {
    return (
      <Home />
    );
  }
}
*/

