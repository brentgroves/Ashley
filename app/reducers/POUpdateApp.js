import {GET_NO_CAT_LIST,SET_NO_CAT_LIST} from '../actions/POUpdateApp';
import POUpdateAPI from '../api/POUpdate';

export default function POUpdateApp( POUpdateApp = [{}], action) {
  switch (action.type) {
    case GET_NO_CAT_LIST:
    {
      console.log('GET noCatList');
      POUpdateAPI.noPOCatList(POUpdateApp);  
      return noCatList;
    }
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


