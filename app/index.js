import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'; 
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';
import * as CHK from "./actions/ChkConst.js"
import * as GRSTATE from "./actions/GRState.js"
import * as PORTSTATE from "./actions/PORTState.js"
import * as PORTCHK from "./actions/PORTChkConst.js"
import * as PROGRESSBUTTON from "./actions/ProgressButtonConst.js"

const initialState = {

	POReqTrans:{ 
		catRecs:[{}],
		catTypes:['cat1','cat2','cat3'],
		chk0:PORTCHK.UNKNOWN,
		chk1:PORTCHK.UNKNOWN,
		chk2:PORTCHK.UNKNOWN,
		chk3:PORTCHK.UNKNOWN,
		chk4:PORTCHK.UNKNOWN,
		currentPO:0,
		goButton:PROGRESSBUTTON.READY, 
		logId:0,
		m2mVendors:[{}],
		m2mVendorSelect:[{}],
		nextPO:0,
		noCatList:[{}],
		noCribVen:[{}],	
		noM2mVen:[{}],	
		poCount:0,
		poItem:[{}],
		poMast:[{}],
		poMastRange:{poMin:0,poMax:0},
		state:PORTSTATE.NOT_PRIMED,
		status:'',
		reason:'',
		vendors:[{}],
		vendorSelect:[{}]
	},

	GenReceivers:{ 
		chk0:CHK.UNKNOWN,
		currentReceiver:0,
		goButton:PROGRESSBUTTON.READY, 
		logId:0,
		shipVia:[{}],
		state:GRSTATE.NOT_PRIMED,
		status:'',
		rcmast:[{}],
		rcmastInsert:{done:false,failed:false},
		reason:'',
		receiverCount:0
	},
	Common:{ 
		primed:false
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
