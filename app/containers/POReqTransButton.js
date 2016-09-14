import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import POReqTransButton from '../components/POReqTransButton';
import * as POUpdateAppActions from '../actions/POUpdateApp';

function mapStateToProps(state) {
  return {
    noCatList: state.NoCatList,
   	checks: state.checks
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POUpdateAppActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POReqTransButton);
