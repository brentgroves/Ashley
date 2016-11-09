import * as CHK from "../actions/ChkConst.js"
import * as GRACTION from "../actions/GRConst.js"
import * as GRSTATE from "../actions/GRState.js"
import * as PROGRESSBUTTON from "../actions/ProgressButtonConst.js"
import update from 'react-addons-update';


export default function reducer( state = {}, action) {
  switch (action.type) {
    case GRACTION.INIT:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log('GR_INIT');
      }
      var newData = update(state, 
        { 
          chk0: {$set: CHK.UNKNOWN},
          currentReceiver:{$set:0},
          goButton:{$set:PROGRESSBUTTON.READY},
          logId:{$set:0},
          receiverCount:{$set:0},
          rcmast:{$set:[{}]},
          reason:{$set:''},
          shipVia:{$set:[{}]},
          state:{$set: GRSTATE.NOT_PRIMED},
          status:{$set: ''}
        });
      return newData;
    }
    case GRACTION.SET_LOGID:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log(`set logId`);
      }
      var newData = update(state, {logId: {$set: action.logId}});
      return newData;
    }
    case GRACTION.SET_CURRENT_RECEIVER:
    {
      var newData = update(state, {currentReceiver: {$set: action.currentReceiver}});
      return newData;
    }
    case GRACTION.SET_GO_BUTTON:
    {
      var newData = update(state, {goButton: {$set: action.goButton}});
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }
    case GRACTION.SET_RCMAST:
    {
      var newData = update(state, {rcmast: {$set: action.rcmast}});
      return newData;
    }
    case GRACTION.UPDATE_RCMAST_FPACKLIST:
    {
      var newData = update(state, {rcmast: {$set: action.rcmast}});
      return newData;
    }
    
    case GRACTION.SET_REASON:
    {
      if ('development'==process.env.NODE_ENV) {
        console.dir(action.reason);
      }
      var newData = update(state, {reason: {$set: action.reason}});
      return newData;
    }
    case GRACTION.SET_RECEIVER_COUNT:
    {
      var newData = update(state, {receiverCount: {$set: action.receiverCount}});
      return newData;
    }
    case GRACTION.SET_SHIP_VIA:
    {
      var newData = update(state, {shipVia: {$set: action.shipVia}});
      return newData;
    }

    case GRACTION.SET_STATE:
    {
      var newData = update(state, {state: {$set: action.state}});
      return newData;
    }
    case GRACTION.SET_STATUS:
    {
      var newData = update(state, {status: {$set: action.status}});
      return newData;
    }
    default:
      return state;
  }
}
