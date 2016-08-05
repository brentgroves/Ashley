import {SET_POCAT} from '../actions/NoCatList';

export default function noCatList( noCatList = [{PONumber:1,Vendor:2,Address1:'1633 S US HWY 33'}], action) {
 // 	getPO();
  switch (action.type) {
    case SET_POCAT:
    {
        console.log('update poList');
        Object.assign({}, state, action.poList);      
      return noCatList;
    }
    default:
      return noCatList;
  }
}


