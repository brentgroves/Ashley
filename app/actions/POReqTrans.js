export const FETCH_PO_CATEGORIES = 'FETCH_PO_CATEGORIES';
export const SET_PO_CATEGORIES = 'SET_PO_CATEGORIES';
export const FETCH_NO_CAT_LIST = 'FETCH_NO_CAT_LIST';
export const SET_NO_CAT_LIST = 'SET_NO_CAT_LIST';
export const SET_CHECK1 = 'SET_CHECK1';
import POReqTrans from '../api/POReqTrans';

export function fetchNoCatList() {
 return (dispatch,getState) => {
    POUpdateAPI.noPOCatList(dispatch);
  };
}

export function setNoCatList(noCatList) {
  return {
    type: SET_NO_CAT_LIST,
    noCatList: noCatList
  };
}

export function fetchPOCategories() {
 return (dispatch,getState) => {
    POReqTrans.fetchPOCategories(dispatch);
  };
}

export function setPOCategories(POCategories) {
  return {
    type: SET_PO_CATEGORIES,
    POCategories: POCategories
  };
}

export function setCheck1(setMe) {
  return {
    type: SET_CHECK1,
    chk1: {chk1:setMe}
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