import {SET_CHECK1} from '../actions/POUpdateApp';
import POUpdateAPI from '../api/POUpdate';

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


