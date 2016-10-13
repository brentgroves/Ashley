

import * as PORTACTION from "./PORTActionConst.js"

import { push } from 'react-router-redux';

import POReqTrans,{updateCheck1,updateCheck2,primeDB} from '../api/POReqTrans';

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

export function initPORT() {
  return {
    type: PORTACTION.INIT_PORT
  };
}

export function primePORT() {
 return (dispatch,getState) => {
    var disp = dispatch;
    primeDB(disp);
  };
}

export function setCheck1(setMe) {
  return {
    type: SET_CHECK1,
    chk1: setMe
  };
}

export function setCheck2(setMe) {
  return {
    type: PORTACTION.SET_CHECK2,
    chk2: setMe
  };
}

export function setGoButton(setMe) {
  return {
    type: PORTACTION.SET_GO_BUTTON,
    goButton: setMe
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


export function setPOCategories(catTypes) {
  return {
    type: PORTACTION.SET_PO_CATEGORIES,
    catTypes: catTypes
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

export function startPORT() {
 return (dispatch,getState) => {
    var disp = dispatch;
    POReqTrans(disp);
  };
}

export function updateChk1(poNumber,item,poCategory) {
 return (dispatch,getState) => {
    var disp = dispatch;
    updateCheck1(disp,poNumber,item,poCategory);
  };
}

export function updateChk2(poNumber,vendorNumber) {
 return (dispatch,getState) => {
    var disp = dispatch;
    updateCheck2(disp,poNumber,vendorNumber);
  };
}





