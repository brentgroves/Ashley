import {SET_PO_CATEGORIES} from '../actions/POReqTrans';
import POReqTrans from '../api/POReqTrans';

export default function POCategories( state = [{}], action) {
  switch (action.type) {
    case SET_PO_CATEGORIES:
    {
      return action.poCategories;
    }
    default:
      return state;
  }
}

