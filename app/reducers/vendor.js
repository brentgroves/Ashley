import { INCREMENT_VENDOR, DECREMENT_VENDOR } from '../actions/vendor';

export default function vendor(state = 0, action) {
  switch (action.type) {
    case INCREMENT_VENDOR:
      return state + 2;
    case DECREMENT_VENDOR:
      return state - 1;
    default:
      return state;
  }
}
