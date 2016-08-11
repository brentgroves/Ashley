import {SET_PO_CATEGORIES} from '../actions/POUpdateApp';
import POUpdateAPI from '../api/POUpdate';

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


