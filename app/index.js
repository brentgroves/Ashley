import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';


const initialState = {
	NoCatList:[{}],
	POCategories:['cat1','cat2','cat3'],
	label:'hello',
	POReqTrans:{ started:'false',btnState:'', chk1:'unknown',chk2:'unknown',chk3:'unknown',chk4:'unknown',noCatList:[{}]}

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
