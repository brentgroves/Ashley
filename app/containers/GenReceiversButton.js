import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GenReceiversButton from '../components/GenReceiversButton';
import * as POReqTrans from '../actions/POReqTrans';

function mapStateToProps(state) {
  return {
    noCatList: state.NoCatList,
   	POReqTrans: state.POReqTrans
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POReqTrans, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GenReceiversButton);
