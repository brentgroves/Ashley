import {GET_NO_CAT_LIST,SET_NO_CAT_LIST} from '../actions/POUpdateApp';

export default function poUpdateApp( noCatList = [{}], action) {
  switch (action.type) {
    case SET_NO_CAT_LIST:
    {
        console.log('update noCatList');
        Object.assign({}, state, action.noCatList);      
      return noCatList;
    }
    default:
      return noCatList;
  }
}


