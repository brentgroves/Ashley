import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import POReqTrans from './POReqTrans';
import GenReceivers from './GenReceivers';
import Common from './Common';
const rootReducer = combineReducers({
  POReqTrans,
  GenReceivers,
  Common,
  routing
});

export default rootReducer;
