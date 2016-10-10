import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PORTGrid from '../components/PORTGrid';
import * as POReqTrans from '../actions/POReqTrans';

function mapStateToProps(state) {
  return {
	POReqTrans: state.POReqTrans
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POReqTrans, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PORTGrid);
