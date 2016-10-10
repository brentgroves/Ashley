

import * as PORTACTION from "./PORTActionConst.js"

import { push } from 'react-router-redux';

import POReqTrans,{updateCheck1,linuxSQLPrime} from '../api/POReqTrans';

export function initPORT() {
  return {
    type: PORTACTION.INIT_PORT
  };
}


export function setStarted(started) {
  return {
    type: PORTACTION.SET_STARTED,
    started: started
  };
}

export function updateChk1(poNumber,item,poCategory) {
 return (dispatch,getState) => {
    var disp = dispatch;
    updateCheck1(disp,poNumber,item,poCategory);
  };
}

export function startPORT() {
 return (dispatch,getState) => {
   // POUpdateAPI.noPOCatList(dispatch);
    //  dispatch(push('/'));
/*    var disp = dispatch;
    dispatch({ type:INIT_PORT });
    linuxSQLPrime();
*/
    var disp = dispatch;
    POReqTrans(disp);
//      POReqTrans.call(this,disp);
  };
}

export function cancelApp() {
 return (dispatch,getState) => {
   // POUpdateAPI.noPOCatList(dispatch);
      dispatch({ type:PORTACTION.INIT_PORT });
      dispatch(push('/'));
/*      var disp = dispatch;
      POReqTrans(disp);
*///      POReqTrans.call(this,disp);
  };
}


export function setNoCribVen(noCribVen) {
  return {
    type: PORTACTION.SET_NO_CRIB_VEN,
    noCribVen: noCribVen
  };
}


export function setNoCatList(noCatList) {
  return {
    type: PORTACTION.SET_NO_CAT_LIST,
    noCatList: noCatList
  };
}

export function getPOCategories() {
 return (dispatch,getState) => {
      var disp = dispatch;
      fetchPOCategories(disp);
 };
}

export function setPOCategories(catTypes) {
  return {
    type: PORTACTION.SET_PO_CATEGORIES,
    catTypes: catTypes
  };
}

export function setGoButton(setMe) {
  return {
    type: PORTACTION.SET_GO_BUTTON,
    goButton: setMe
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


