import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Testsql from '../components/Testsql';
import * as VendorActions from '../actions/vendor';

function mapStateToProps(state) {
  return {
    vendor: state.vendor
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(VendorActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Testsql);
