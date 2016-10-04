import {SET_CHECK1,SET_GO_BUTTON, SET_NO_CAT_LIST, SET_PO_CATEGORIES} from '../actions/POReqTrans';
import POReqTrans from '../api/POReqTrans';
import update from 'react-addons-update';


export default function reducer( state = {}, action) {
  switch (action.type) {
    case SET_CHECK1:
    {
    	var newData = update(state, {chk1: {$set: action.chk1}});
    //	return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
    	return newData;
    }
    case SET_GO_BUTTON:
    {
      var newData = update(state, {goButton: {$set: action.goButton}});
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }
    case SET_PO_CATEGORIES:
    {
      console.log('update PO Categories list');
      var newData = update(state, 
        { catTypes: {$set: action.catTypes}
        });
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }
    case SET_NO_CAT_LIST:
    {
      console.log('update noCatList');
      var newData = update(state, 
        { 
          noCatList: {$set: action.noCatList}
        });
/*
     var newData = update(state, 
        { 
          btnState:{$set:'error'},
          chk1: {$set: 'failure'},
          noCatList: {$set: action.noCatList}
        });
        */
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }


    default:
      return state;
  }
}
