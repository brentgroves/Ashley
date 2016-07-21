import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NoVenPoList from '../components/NoVenPoList';
import * as noVenPoListActions from '../actions/NoVenPoList';

function mapStateToProps(state) {
  return {
    noVenPoList: state.noVenPoList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(noVenPoListActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoVenPoList);
