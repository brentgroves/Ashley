import {SET_STARTED,SET_CHECK1,INIT_PORT,SET_GO_BUTTON, SET_NO_CAT_LIST, SET_PO_CATEGORIES,SET_PO_CAT_RECORDS} from '../actions/POReqTrans';

import update from 'react-addons-update';


export default function reducer( state = {}, action) {
  switch (action.type) {
    case SET_STARTED:
    {
      var newData = update(state, {started: {$set: action.started}});
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }
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
    case SET_PO_CAT_RECORDS:
    {
      console.log('update PO Cat Records list');
      var newData = update(state, 
        { catRecs: {$set: action.catRecs}
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
    case INIT_PORT:
    {
      console.log('INIT_PORT');
      var newData = update(state, 
        { 
          catTypes:{$set: ['cat1','cat2','cat3']},
          catRecs:{$set: [{}]},  
          chk1: {$set: 'unknown'},
          chk2: {$set: 'unknown'},
          chk3: {$set: 'unknown'},
          chk4: {$set: 'unknown'},
          goButton:{$set:''},
          noCatList:{$set: [{}]},
          started:{$set: false},
        });
      return newData;
    }
    default:
      return state;
  }
}
