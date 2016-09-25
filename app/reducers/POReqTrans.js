import {SET_CHECK1, SET_NO_CAT_LIST} from '../actions/POReqTrans';
import POReqTrans from '../api/POReqTrans';
import update from 'react-addons-update';


export default function reducer( state = {}, action) {
  switch (action.type) {
    case SET_CHECK1:
    {
    	var newData = update(state, {chk1: {$set: action.status}});
    //	return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
    	return newData;
    }
    case SET_NO_CAT_LIST:
    {
      console.log('update noCatList');
      var newData = update(state, 
        { noCatList: {$set: action.noCatList},
          chk1: {$set: 'success'},
          btnState:{$set:'success'}
        });
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }

    default:
      return state;
  }
}
