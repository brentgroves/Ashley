import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import NoCatList from './NoCatList';
import POCategories from './POCategories';

const rootReducer = combineReducers({
  counter,
  NoCatList,
  POCategories,
  routing
});

export default rootReducer;
