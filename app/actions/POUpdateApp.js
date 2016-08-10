export const GET_NO_CAT_LIST = 'GET_NO_CAT_LIST';
export const SET_NO_CAT_LIST = 'SET_NO_CAT_LIST';

export function getNoCatList() {
  return {
    type: GET_NO_CAT_LIST
  };
}

export function setNoCatList(noCatList) {
  return {
    type: SET_NO_CAT_LIST,
    noCatList:noCatList
  };
}


/*
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