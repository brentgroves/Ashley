import {SET_NO_CAT_LIST} from '../actions/POReqTrans';
import POReqTrans from '../api/POReqTrans';

export default function noCatList( state = [{}], action) {
  switch (action.type) {
    case SET_NO_CAT_LIST:
    {
        console.log('update noCatList');
  //      Object.assign({}, state.noCatList, action.noCatList);      
      return action.noCatList;
    }
    default:
      return state;
  }
}


