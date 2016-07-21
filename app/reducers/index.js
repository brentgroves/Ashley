import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import vendor from './vendor';
import noVenPoList from './NoVenPoList';

const rootReducer = combineReducers({
  counter,
  vendor,
  noVenPoList,
  routing
});

export default rootReducer;
