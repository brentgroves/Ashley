import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';


const initialState = {
	POReqTrans:{ 
		started:false,
		goButton:'', 
		chk1:'unknown',
		chk2:'unknown',
		chk3:'unknown',
		chk4:'unknown',
		noCatList:[{}],
		catTypes:['cat1','cat2','cat3'],
		catRecs:[{}]	
	}

//	noVenPoList:[{PONumber:1,Vendor:2,Address1:'1633 S US HWY 33'}]
}
const store = configureStore(initialState);
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
