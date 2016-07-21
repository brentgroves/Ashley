import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import TestsqlPage from './containers/TestsqlPage';
import NoVenPoListPage from './containers/NoVenPoListPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/counter" component={CounterPage} />
    <Route path="/testsql" component={TestsqlPage} />
    <Route path="/noVenPoList" component={NoVenPoListPage} />
  </Route>
);
