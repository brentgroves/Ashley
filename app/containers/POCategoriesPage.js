import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import POCategories from '../components/POCategories';
import * as POUpdateAppActions from '../actions/POUpdateApp';

function mapStateToProps(state) {
  return {
    	poCategories: state.POCategories
	};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POUpdateAppActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POCategories);
