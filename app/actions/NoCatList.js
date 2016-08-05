export const GET_NO_VEN_PO_LIST = 'GET_NO_CAT_LIST';
export const SET_POLIST = 'SET_POLIST';

export function getNoCatList() {
  return {
    type: GET_NO_CAT_LIST
  };
}

export function setPOList(poList) {
  return {
    type: SET_POLIST,
    po:poList
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