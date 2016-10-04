export const SET_PO_CATEGORIES = 'SET_PO_CATEGORIES';
export const SET_NO_CAT_LIST = 'SET_NO_CAT_LIST';
export const SET_CHECK1 = 'SET_CHECK1';
export const SET_GO_BUTTON = 'SET_GO_BUTTON';
import POReqTrans,{fetchPOCategories} from '../api/POReqTrans';

export function getNoCatList() {
 return (dispatch,getState) => {
   // POUpdateAPI.noPOCatList(dispatch);
      var disp = dispatch;
      POReqTrans(disp);
//      POReqTrans.call(this,disp);
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