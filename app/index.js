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
import * as RPTSTATE from "./actions/Rpt/State.js"
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
		bpGRFinish:{done:false,failed:false},
		bpGRGenReceivers:{done:false,failed:false},
		bpGRGetLogEntryLast:{done:false,failed:false},
		bpGRLogStepSet:{done:false,failed:false},
		bpGRPOStatusUpdate:{done:false,failed:false},
		bpGRReceiverCount:{done:false,failed:false},
		bpGRReceiversCribDelete:{done:false,failed:false},
		bpGRReceiversM2mDelete:{done:false,failed:false},
		bpGRSetCurrentReceiver:{done:false,failed:false},
		bpGRTransDelete:{done:false,failed:false},
		bpGRTransInsert:{done:false,failed:false},
		chk0:CHK.UNKNOWN,
		chk1:CHK.UNKNOWN,
		chk2:CHK.UNKNOWN,
		chk3:CHK.UNKNOWN,
		currentReceiver:0,
		goButton:PROGRESSBUTTON.READY, 
		logEntryLast:{},
		logId:0,
		logInsert:{done:false,failed:false},
		poStatusReport:{pdf:'',done:false,failed:false},
		rcitem:[{}],
		rcitemInsert:{done:false,failed:false},
		rcitemUpdate:{done:false,failed:false},
		rcmast:[{}],
		rcmastRange:{start:0,end:0},
		rcmastInsert:{done:false,failed:false},
		rcvJoin:[{}],
		reason:'',
		receiverCount:0,
		rollback:{done:false,failed:false},
		shipVia:[{}],
		state:GRSTATE.NOT_PRIMED,
		status:'',
		shipViaQry:{done:false,failed:false},
		sqlExec:{done:false,failed:false}
	},
	Reports:{ 
		progressBtn:PROGRESSBUTTON.READY, 
		poStatusReport:{pdf:'',done:false,failed:false},
		reason:'',
		state:RPTSTATE.NOT_STARTED,
		status:'',
		openPO:{
			curPage:1,
			dateStart:null,
			dateEnd:null,
			maxPage:3,
			poItem:[],
/*			
select 1 page,0 selected,0 visible,ord.poDate,ord.poNumber,
case
 when ven.VendorName is null then 'None'
 else ven.VendorName
end vendorName,
case
 when ven.EMailAddress is null then 'None'
 else ven.EMailAddress
end eMailAddress,
ord.item,
case
 when ord.ItemDescription is null then 'None'
 else ord.ItemDescription
end itemDescription,
ord.qtyOrd,
case
 when rcv.qtyReceived is null then 0
 else rcv.qtyReceived
end qtyReceived,
received

			  {page:1,selected:false,visible:false,fpono: "111111", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
			  {page:1,selected:false,visible:false,fpono: "111111", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
			  {page:1,selected:false,visible:false,fpono: "111112", fstatus:'OPEN',fpartno:'3',fordqty: 1, frcvqty:1},
			  {page:1,selected:false,visible:false,fpono: "111112", fstatus:'OPEN',fpartno:'4',fordqty: 1, frcvqty:1},
			  {page:1,selected:false,visible:false,fpono: "111113", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
			  {page:1,selected:false,visible:false,fpono: "111113", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
			  {page:1,selected:false,visible:false,fpono: "111114", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
			  {page:2,selected:false,visible:false,fpono: "111114", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
			  {page:2,selected:false,visible:false,fpono: "111115", fstatus:'OPEN',fpartno:'3',fordqty: 1, frcvqty:1},
			  {page:2,selected:false,visible:false,fpono: "111115", fstatus:'OPEN',fpartno:'4',fordqty: 1, frcvqty:1},
			  {page:2,selected:false,visible:false,fpono: "111116", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
			  {page:2,selected:false,visible:false,fpono: "111116", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
			  {page:2,selected:false,visible:false,fpono: "111117", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
			  {page:3,selected:false,visible:false,fpono: "111117", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
			  {page:3,selected:false,visible:false,fpono: "111118", fstatus:'OPEN',fpartno:'3',fordqty: 1, frcvqty:1},
			  {page:3,selected:false,visible:false,fpono: "111118", fstatus:'OPEN',fpartno:'4',fordqty: 1, frcvqty:1},
			  {page:3,selected:false,visible:false,fpono: "111119", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
			  {page:3,selected:false,visible:false,fpono: "111119", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
			]
			*/
		},
		openPOPager:{done:false,failed:false},
		products: [
		  {rowStyle:{display: 'none'},category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
		  {rowStyle:{display: 'none'},category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
		  {rowStyle:{display: 'none'},category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
		  {rowStyle:{},category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
		  {rowStyle:{},category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
		  {rowStyle:{},category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
		],
		sqlOpenPOVendorEmail:{done:false,failed:false},

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
