import * as PORTACTION from "./PORTActionConst.js"

import { push } from 'react-router-redux';

import POReqTrans,{updateCheck1,updateCheck2,updateCheck3,primeDB,startCheck3} from '../api/POReqTrans';

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

export function primePORT(updateState) {
  if(updateState){
   return (dispatch,getState) => {
      var disp = dispatch;
      primeDB(disp,true);
    };
  }else{
   return (dispatch,getState) => {
      var disp = dispatch;
      primeDB(disp,false);
    };
  }
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

export function setCheck3(setMe) {
  return {
    type: PORTACTION.SET_CHECK3,
    chk3: setMe
  };
}

export function setGoButton(setMe) {
  return {
    type: PORTACTION.SET_GO_BUTTON,
    goButton: setMe
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

export function setCurrentPO(nextPO) {
  return {
    type: PORTACTION.SET_CURRENT_PO,
    currentPO: currentPO
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

export function startChk3() {
 return (dispatch,getState) => {
      var disp = dispatch;
      startCheck3(disp);
 };
}

export function startPORT(prime) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    POReqTrans(disp,getSt,prime);
  };
}

export function updateChk1(poNumber,item,poCategory,startPORT) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    updateCheck1(disp,getSt,poNumber,item,poCategory,startPORT);
  };
}

export function updateChk2(poNumber,vendorNumber,Address1,Address2,Address3,Address4,startPORT) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    updateCheck2(disp,getSt,poNumber,vendorNumber,Address1,Address2,Address3,Address4,startPORT);
  };
}

export function updateChk3(vendorNumber,newM2mVendor,startPORT) {
 return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    updateCheck3(disp,getSt,vendorNumber,newM2mVendor,startPORT);
  };
}




