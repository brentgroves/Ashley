import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import POUpdateAppPage from './containers/POUpdateAppPage';
import POReqTransPage from './containers/POReqTransPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/counter" component={CounterPage} />
    <Route path="/POUpdateApp" component={POUpdateAppPage} />
    <Route path="/POReqTrans" component={POReqTransPage} />
  </Route>
);
/*
    <Route path="/POUpdateApp" component={POUpdateAppPage} />

*/