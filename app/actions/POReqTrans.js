import * as PORTACTION from "./PORTActionConst.js"
import { push } from 'react-router-redux';
import * as SQLPRIMEDB from "../api/SQLPrimeDB.js"
import * as PORTAPI from '../api/POReqTrans';
import * as MISC from "../api/Misc.js"


export function cancelApp() {
 return (dispatch,getState) => {
      dispatch({ type:PORTACTION.INIT_PORT });
      dispatch(push('/'));
  };
}

export function getPOCategories() {
 return (dispatch,getState) => {
      var disp = dispatch;
      fetchPOCategories(disp);
 };
}

export function getPOCount() {
  return {
    type: PORTACTION.GET_PO_COUNT
  };
}


export function initPORT() {
  return {
    type: PORTACTION.INIT_PORT
  };
}

export function primePORT() {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    PORTAPI.primePORT(disp,getSt);
  }
}

export function setCheck0(chk0) {
  return {
    type: SET_CHECK0,
    chk0: chk0
  };
}

export function setCheck1(chk1) {
  return {
    type: SET_CHECK1,
    chk1: chk1
  };
}

export function setCheck2(chk2) {
  return {
    type: PORTACTION.SET_CHECK2,
    chk2: chk2
  };
}

export function setCheck3(chk3) {
  return {
    type: PORTACTION.SET_CHECK3,
    chk3: chk3
  };
}

export function setCheck4(chk4) {
  return {
    type: PORTACTION.SET_CHECK4,
    chk4: chk4
  };
}

export function setCurrentPO(currentPO) {
  return {
    type: PORTACTION.SET_CURRENT_PO,
    currentPO: currentPO
  };
}

export function setGoButton(setMe) {
  return {
    type: PORTACTION.SET_GO_BUTTON,
    goButton: setMe
  };
}

export function setLogId(logId) {
  return {
    type: PORTACTION.SET_LOG_ID,
    logId: logId
  };
}

export function setM2MVendors(m2mVendors) {
  return {
    type: PORTACTION.SET_M2M_VENDORS,
    m2mVendors: m2mVendors
  };
}

export function setM2mVendorSelect(m2mVendorSelect) {
  return {
    type: PORTACTION.SET_M2M_VENDOR_SELECT,
    m2mVendorSelect: m2mVendorSelect
  };
}


export function setNextPO(nextPO) {
  return {
    type: PORTACTION.SET_NEXT_PO,
    nextPO: nextPO
  };
}

export function setNoCatList(noCatList) {
  return {
    type: PORTACTION.SET_NO_CAT_LIST,
    noCatList: noCatList
  };
}

export function setNoCribVen(noCribVen) {
  return {
    type: PORTACTION.SET_NO_CRIB_VEN,
    noCribVen: noCribVen
  };
}

export function setNoM2mVen(noM2mVen) {
  return {
    type: PORTACTION.SET_NO_M2M_VEN,
    noM2mVen: noM2mVen
  };
}

export function setPOCategories(catTypes) {
  return {
    type: PORTACTION.SET_PO_CATEGORIES,
    catTypes: catTypes
  };
}

export function setPOCount(poCount) {
  return {
    type: PORTACTION.SET_PO_COUNT,
    poCount: poCount
  };
}
export function setPOItem(poItem) {
  return {
    type: PORTACTION.SET_POITEM,
    poItem: poItem
  };
}

export function setPOMast(poMast) {
  return {
    type: PORTACTION.SET_POMAST,
    poMast: poMast
  };
}

export function setPOMastRange(poMin,poMax) {
  return {
    type: PORTACTION.SET_POMAST_RANGE,
    poMastRange: {poMin:poMin,poMax:poMax}
  };
}

export function setPrimed(primed) {
  return {
    type: PORTACTION.SET_PRIMED,
    primed: primed
  };
}

export function setState(state) {
  return {
    type: PORTACTION.SET_STATE,
    state: state
  };
}

export function setStatus(status) {
  return {
    type: PORTACTION.SET_STATUS,
    status: status
  };
}

export function setVendors(vendors) {
  return {
    type: PORTACTION.SET_VENDORS,
    vendors: vendors
  };
}

export function setVendorSelect(vendorSelect) {
  return {
    type: PORTACTION.SET_VENDOR_SELECT,
    vendorSelect: vendorSelect
  };
}

export function startChk3() {
 return (dispatch,getState) => {
      var disp = dispatch;
      PORTAPI.startCheck3(disp);
 };
}

export function startPORT(prime) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    PORTAPI.POReqTrans(disp,getSt,prime);
  };
}

export function updateChk1(poNumber,item,poCategory,startPORT) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    PORTAPI.updateCheck1(disp,getSt,poNumber,item,poCategory,startPORT);
  };
}

export function updateChk2(poNumber,vendorNumber,Address1,Address2,Address3,Address4,startPORT) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    PORTAPI.updateCheck2(disp,getSt,poNumber,vendorNumber,Address1,Address2,Address3,Address4,startPORT);
  };
}

export function updateChk3(vendorNumber,newM2mVendor,startPORT) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    PORTAPI.updateCheck3(disp,getSt,vendorNumber,newM2mVendor,startPORT);
  };
}



