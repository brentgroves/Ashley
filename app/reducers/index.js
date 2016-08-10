import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import noUpdateApp from './NoUpdateApp';

const rootReducer = combineReducers({
  counter,
  noUpdateApp,
  routing
});

export default rootReducer;
