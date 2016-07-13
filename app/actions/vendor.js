export const INCREMENT_VENDOR = 'INCREMENT_VENDOR';
export const DECREMENT_VENDOR = 'DECREMENT_VENDOR';

export function increment() {
  return {
    type: INCREMENT_VENDOR
  };
}

export function decrement() {
  return {
    type: DECREMENT_VENDOR
  };
}

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
