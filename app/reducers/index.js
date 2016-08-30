import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import NoCatList from './NoCatList';
import POCategories from './POCategories';
import checks from './checks';

const rootReducer = combineReducers({
  counter,
  NoCatList,
  POCategories,
  checks,
  routing
});

export default rootReducer;
