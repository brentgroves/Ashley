import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import vendor from './vendor';
import po from './po';

const rootReducer = combineReducers({
  counter,
  vendor,
  po,
  routing
});

export default rootReducer;
