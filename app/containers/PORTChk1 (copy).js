import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PORTChk1 from '../components/PORTChk1';
import * as POReqTrans from '../actions/POReqTrans';

function mapStateToProps(state) {
  return {
    noCatList: state.POReqTrans.noCatList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POReqTrans, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PORTChk1);
