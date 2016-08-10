import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NoCatList from '../components/NoCatList';
import * as noCatListActions from '../actions/NoCatList';

function mapStateToProps(state) {
  return {
    noCatList: state.noCatList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(noCatListActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoCatList);
