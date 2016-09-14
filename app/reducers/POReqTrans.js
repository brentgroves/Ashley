import {SET_CHECK1} from '../actions/POReqTrans';
import POReqTrans from '../api/POReqTrans';

export default function checks( state = {}, action) {
  switch (action.type) {
    case SET_CHECK1:
    {
      return action.checks;
    }
    default:
      return state;
  }
}
