import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NoCatGriddle from '../components/NoCatGriddle';
import * as POUpdateAppActions from '../actions/POUpdateApp';

function mapStateToProps(state) {
  return {
    noCatList: state.NoCatList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(POUpdateAppActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoCatGriddle);
