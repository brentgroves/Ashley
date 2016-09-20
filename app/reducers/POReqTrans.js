import {SET_CHECK1} from '../actions/POReqTrans';
import POReqTrans from '../api/POReqTrans';
import update from 'react-addons-update';


export default function checks( state = {}, action) {
  switch (action.type) {
    case SET_CHECK1:
    {
    	var newData = update(state, {
		  chk1: {$set: 'failure'}
		});
    //	return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      	return newData;
    }
    default:
      return state;
  }
}
