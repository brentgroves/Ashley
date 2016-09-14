import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import NoCatList from './NoCatList';
import POCategories from './POCategories';
import POReqTrans from './POReqTrans';

const rootReducer = combineReducers({
  NoCatList,
  POCategories,
  POReqTrans,
  routing
});

export default rootReducer;
