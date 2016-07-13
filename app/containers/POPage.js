import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PO from '../components/PO';
import * as POActions from '../actions/po';

function mapStateToProps(state) {
  return {
    po: state.po
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PO);
