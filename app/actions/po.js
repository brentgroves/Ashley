export const RETRIEVE_PO = 'RETRIEVE_PO';
export const SET_POLIST = 'SET_POLIST';

export function retrievePO() {
  return {
    type: RETRIEVE_PO
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

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
*/