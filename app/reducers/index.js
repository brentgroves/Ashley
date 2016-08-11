import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import POUpdateApp from './POUpdateApp';

const rootReducer = combineReducers({
  counter,
  POUpdateApp,
  routing
});

export default rootReducer;
