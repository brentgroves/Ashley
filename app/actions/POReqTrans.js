export const CANCEL_APP = 'CANCEL_APP';
export const INIT_PORT = 'INIT_PORT';
export const SET_CHECK1 = 'SET_CHECK1';
export const SET_CHECK2 = 'SET_CHECK2';
export const SET_GO_BUTTON = 'SET_GO_BUTTON';
export const SET_NO_CAT_LIST = 'SET_NO_CAT_LIST';
export const SET_NO_CRIB_VEN = 'SET_NO_CRIB_VEN';
export const SET_PO_CATEGORIES = 'SET_PO_CATEGORIES';
export const SET_PO_CAT_RECORDS = 'SET_PO_CAT_RECORDS';
export const SET_STARTED = 'SET_STARTED';
export const UPDATE_CHK1 = 'UPDATE_CHK1';

import { push } from 'react-router-redux';

import POReqTrans,{updateCheck1,linuxSQLPrime} from '../api/POReqTrans';

export function initPORT() {
  return {
    type: INIT_PORT
  };
}


export function setStarted(started) {
  return {
    type: SET_STARTED,
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
      dispatch({ type:INIT_PORT });
      dispatch(push('/'));
/*      var disp = dispatch;
      POReqTrans(disp);
*///      POReqTrans.call(this,disp);
  };
}


export function setNoCribVen(noCribVen) {
  return {
    type: SET_NO_CRIB_VEN,
    noCribVen: noCribVen
  };
}


export function setNoCatList(noCatList) {
  return {
    type: SET_NO_CAT_LIST,
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
    type: SET_PO_CATEGORIES,
    catTypes: catTypes
  };
}

export function setGoButton(setMe) {
  return {
    type: SET_GO_BUTTON,
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
    type: SET_CHECK2,
    chk2: setMe
  };
}


/*
 fetchAirports(origin, destination) {
 return (dispatch) => {
 dispatch({ type: REQUEST_AIRPORTS });
 AirCheapAPI.fetchAirports().then(
 (airports) => dispatch({ type: RECEIVE_AIRPORTS, success:true, airports }),
 (error) => dispatch({ type: RECEIVE_AIRPORTS, success:false })
 );
 };

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { vendor } = getState();

    if (vendor % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

*/