import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NoCatGriddle from '../components/NoCatGriddle';
import * as POReqTrans from '../actions/POReqTrans';

function mapStateToProps(state) {
  return {
    noCatList: state.NoCatList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POReqTrans, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoCatGriddle);
