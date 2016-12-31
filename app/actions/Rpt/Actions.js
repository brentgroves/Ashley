import * as ACTION from "./Const.js"
import * as State from "./State.js"
import { push } from 'react-router-redux';
import * as API from '../../api/Rpt/Reports';
import * as MISC from "../../api/Misc.js"
var _ = require('lodash');
var joins = require('lodash-joins');

//Supervisor-PLT-7

export function cancelApp() {
  if ('development'==process.env.NODE_ENV) {
    console.log(`ACTIONS.CancelApp()->top.`);
  }

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


export function OpenPOPager() {
  if ('development'==process.env.NODE_ENV) {
    console.log(`ACTIONS.OpenPOPager()->top.`);
  }

 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    API.OpenPOPager(disp,getSt);
  };
}

export function OpenPOVendorEmail() {
  if ('development'==process.env.NODE_ENV) {
    console.log(`ACTIONS.OpenPOVendorEmail()->top.`);
  }

 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    API.OpenPOVendorEmail(disp,getSt);
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

export function POVendorEmail() {
  if ('development'==process.env.NODE_ENV) {
    console.log(`ACTIONS.POVendorEmail()->top.`);
  }

 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    API.POVendorEmail(disp,getSt);
  };
}


export function setProductCategoryStyle(category,style) {
  return {
    type: ACTION.SET_PRODUCTS_CATEGORY_STYLE,
    category: category,
    style:style
  };
}


export function setOpenPOCurPage(curPage) {
  return {
    type: ACTION.SET_OPENPO_CURPAGE,
    curPage: curPage
  };
}
export function setOpenPOPrevPage() {
  return {
    type: ACTION.SET_OPENPO_PREVPAGE
  };
}
export function setOpenPONextPage() {
  return {
    type: ACTION.SET_OPENPO_NEXTPAGE
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


export function toggleOpenPOSelected(fpono) {
  return {
    type: ACTION.TOGGLE_OPEN_PO_SELECTED,
    fpono:fpono
  };
}

export function toggleOpenPOVisible(fpono) {
  if ('development'==process.env.NODE_ENV) {
    console.log(`ACTIONS.toggleOpenPOVisible()->top.`);
  }

 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    API.ToggleOpenPOVisible(disp,getSt,fpono);
  };
}



