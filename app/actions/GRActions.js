import * as GRACTION from "./GRConst.js"
import { push } from 'react-router-redux';
import * as GRAPI from '../api/GenReceivers';
import * as MISC from "../api/Misc.js"


export function cancelApp() {
 return (dispatch,getState) => {
      dispatch({ type:GRACTION.INIT });
      dispatch(push('/'));
  };
}

export function init() {
  return {
    type: GRACTION.INIT
  };
}

export function prime() {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    GRAPI.prime(disp,getSt);
  }
}

export function setLogId(logId) {
  return {
    type: GRACTION.SET_LOGID,
    logId: logId
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

export function start(prime) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    GRAPI.start(disp,getSt,prime);
  };
}




