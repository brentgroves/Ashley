import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GRGrid from '../../components/GR/GRGrid';
import * as GRActions from '../../actions/GRActions';

function mapStateToProps(state) {
  return {
    	GenR: state.GenReceivers
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GRActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GRGrid);
