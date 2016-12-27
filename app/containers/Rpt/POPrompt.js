import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import POPrompt from '../../components/Rpt/POPrompt';
import * as Actions from '../../actions/Rpt/Actions';

function mapStateToProps(state) {
  return {
    	Rpt: state.Reports
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POPrompt);


