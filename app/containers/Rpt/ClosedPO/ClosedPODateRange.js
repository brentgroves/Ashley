import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ClosedPODateRange from '../../../components/Rpt/ClosedPO/ClosedPODateRange';
import * as Actions from '../../../actions/Rpt/Actions';

function mapStateToProps(state) {
  return {
    	Rpt: state.Reports
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClosedPODateRange);


