import * as ACTION from "./Const.js"
import * as State from "./State.js"
import { push } from 'react-router-redux';
import * as API from '../../api/Rpt/Reports';
import * as MISC from "../../api/Misc.js"
//Supervisor-PLT-7

export function cancelApp() {
 return (dispatch,getState) => {
      dispatch({ type:ACTION.INIT });
      dispatch(push('/'));
  };
}



export function init() {
  return {
    type: ACTION.INIT
  };
}

export function POStatusReport() {
  if ('development'==process.env.NODE_ENV) {
    console.log(`ACTIONS.POStatusReport()->top.`);
  }

 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    API.POStatusReport(disp,getSt);
  };
}


export function setProgressBtn(goButton) {
  return {
    type: ACTION.SET_PROGRESS_BTN,
    progressBtn: progressBtn
  };
}



export function setState(state) {
  return {
    type: ACTION.SET_STATE,
    state: state
  };
}

export function setStatus(status) {
  return {
    type: ACTION.SET_STATUS,
    status: status
  };
}





