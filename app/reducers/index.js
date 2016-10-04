import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import POReqTrans from './POReqTrans';

const rootReducer = combineReducers({
  POReqTrans,
  routing
});

export default rootReducer;
