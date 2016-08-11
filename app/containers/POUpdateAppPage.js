import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import POUpdateApp from '../components/POUpdateApp';
import * as POUpdateAppActions from '../actions/POUpdateApp';

function mapStateToProps(state) {
  return {
    	noCatList: state.NoCatList,
    	poCategories: state.POCategories
	};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POUpdateAppActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POUpdateApp);
