import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';
import * as PORTSTATE from "./actions/PORTState.js"
import * as PORTCHK from "./actions/PORTChkConst.js"

const initialState = {
	POReqTrans:{ 
		catRecs:[{}],
		catTypes:['cat1','cat2','cat3'],
		chk1:PORTCHK.UNKNOWN,
		chk2:PORTCHK.UNKNOWN,
		chk3:PORTCHK.UNKNOWN,
		chk4:PORTCHK.UNKNOWN,
		goButton:'', 
		noCatList:[{}],
		noCribVen:[{}],	
		primed:false,
		state:PORTSTATE.NOT_PRIMED,
		reason:'',
		vendors:[{}],
		vendorSelect:[{}]
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
