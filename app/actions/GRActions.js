import * as GRACTION from "./GRConst.js"
import { push } from 'react-router-redux';
import * as GRAPI from '../api/GR/GenReceivers';
import * as MISC from "../api/Misc.js"
//Supervisor-PLT-7

export function cancelApp() {
 return (dispatch,getState) => {
      dispatch({ type:GRACTION.INIT });
      dispatch(push('/'));
  };
}

export function closePOsReceivedDone(done) {
  return {
    type: GRACTION.CLOSE_POS_RECEIVED_DONE,
    done:done
  };
}

export function closePOsReceivedFailed(failed) {
  return {
    type: GRACTION.CLOSE_POS_RECEIVED_FAILED,
    failed:failed
  };
}

export function currentReceiverDone(done) {
  return {
    type: GRACTION.CURRENT_RECEIVER_DONE,
    done:done
  };
}

export function currentReceiverFailed(failed) {
  return {
    type: GRACTION.CURRENT_RECEIVER_FAILED,
    failed:failed
  };
}


export function genReceiversDone(done) {
  return {
    type: GRACTION.GEN_RECEIVERS_DONE,
    done:done
  };
}

export function genReceiversFailed(failed) {
  return {
    type: GRACTION.GEN_RECEIVERS_FAILED,
    failed:failed
  };
}


export function logInsertDone(done) {
  return {
    type: GRACTION.LOG_INSERT_DONE,
    done:done
  };
}

export function logInsertFailed(failed) {
  return {
    type: GRACTION.LOG_INSERT_FAILED,
    failed:failed
  };
}

export function init() {
  return {
    type: GRACTION.INIT
  };
}

export function m2mGenReceivers() {
  if ('development'==process.env.NODE_ENV) {
    console.log(`GRACTIONS.m2mGenReceivers()->top.`);
  }

 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    GRAPI.m2mGenReceivers(disp,getSt);
  };
}

export function prime() {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    GRAPI.prime(disp,getSt);
  }
}

export function receiverCountDone(done) {
  return {
    type: GRACTION.RECEIVER_COUNT_DONE,
    done:done
  };
}

export function receiverCountFailed(failed) {
  return {
    type: GRACTION.RECEIVER_COUNT_FAILED,
    failed:failed
  };
}

export function rcitemInsertDone(done) {
  return {
    type: GRACTION.RCITEM_INSERT_DONE,
    done:done
  };
}

export function rcitemInsertFailed(failed) {
  return {
    type: GRACTION.RCITEM_INSERT_FAILED,
    failed:failed
  };
}




export function rcmastInsertDone(done) {
  return {
    type: GRACTION.RCMAST_INSERT_DONE,
    done:done
  };
}

export function rcmastInsertFailed(failed) {
  return {
    type: GRACTION.RCMAST_INSERT_FAILED,
    failed:failed
  };
}


export function rcitemUpdateDone(done) {
  return {
    type: GRACTION.RCITEM_UPDATE_DONE,
    done:done
  };
}

export function rcitemUpdateFailed(failed) {
  return {
    type: GRACTION.RCITEM_UPDATE_FAILED,
    failed:failed
  };
}


export function setCurrentReceiver(currentReceiver) {
  return {
    type: GRACTION.SET_CURRENT_RECEIVER,
    currentReceiver: currentReceiver
  };
}

export function setGoButton(goButton) {
  return {
    type: GRACTION.SET_GO_BUTTON,
    goButton: goButton
  };
}

export function setLogId(logId) {
  return {
    type: GRACTION.SET_LOGID,
    logId: logId
  };
}

export function setRCMast(rcmast) {
  return {
    type: GRACTION.SET_RCMAST,
    rcmast:rcmast
  };
}

export function SetRCMastRange(rcmast) {
  return {
    type: GRACTION.SET_RCMAST_RANGE,
    rcmastRange:rcmastRange
  };
}

export function setRCItem(rcitem) {
  return {
    type: GRACTION.SET_RCITEM,
    rcitem:rcitem
  };
}

export function setReceiverCount(receiverCount) {
  return {
    type: GRACTION.SET_RECEIVER_COUNT,
    receiverCount: receiverCount
  };
}

export function setShipVia(shipVia) {
  return {
    type: GRACTION.SET_SHIP_VIA,
    shipVia: shipVia
  };
}

export function setState(state) {
  return {
    type: GRACTION.SET_STATE,
    state: state
  };
}

export function setStatus(status) {
  return {
    type: GRACTION.SET_STATUS,
    status: status
  };
}

export function shipViaDone(done) {
  return {
    type: GRACTION.SHIP_VIA_DONE,
    done:done
  };
}

export function shipViaFailed(failed) {
  return {
    type: GRACTION.SHIP_VIA_FAILED,
    failed:failed
  };
}

export function start(prime) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    GRAPI.start(disp,getSt,prime);
  };
}



