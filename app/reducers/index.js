import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import vendor from './vendor';
import noCatList from './NoCatList';

const rootReducer = combineReducers({
  counter,
  vendor,
  noCatList,
  routing
});

export default rootReducer;
