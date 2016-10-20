import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import update from 'react-addons-update';


export default function reducer( state = {}, action) {
  switch (action.type) {
    case PORTACTION.INIT_PORT:
    {
      console.log('INIT_PORT');
      var newData = update(state, 
        { 
          catRecs:{$set: [{}]},  
          catTypes:{$set: ['cat1','cat2','cat3']},
          chk1: {$set: 'unknown'},
          chk2: {$set: 'unknown'},
          chk3: {$set: 'unknown'},
          chk4: {$set: 'unknown'},
          currentPO:{$set:''},
          goButton:{$set:''},
          m2mVendors:{$set:[{}]},
          m2mVendorSelect:{$set:[{}]},
          noCatList:{$set: [{}]},
          noCribVen:{$set: [{}]},  
          noM2mVen:{$set: [{}]},  
          state:{$set: PORTSTATE.NOT_PRIMED},
          reason:{$set:''},
          vendors:{$set:[{}]},
          vendorSelect:{$set:[{}]}
        });
      return newData;
    }
    case PORTACTION.SET_CHECK1:
    {
      console.log(`set check1`);
      var newData = update(state, 
        { 
          chk1: {$set: action.chk1}
        });
      return newData;

    }
    case PORTACTION.SET_CHECK2:
    {
      console.log(`set check2`);
      var newData = update(state, 
        { 
          chk2: {$set: action.chk2}
        });
      return newData;

    }
    case PORTACTION.SET_CHECK3:
    {
      console.log(`set check3`);
      var newData = update(state, 
        { 
          chk3: {$set: action.chk3}
        });
      return newData;

    }
    case PORTACTION.SET_CURRENT_PO:
    {
      console.log(`set currentPO`);
      var newData = update(state, 
        { 
          currentPO: {$set: action.currentPO}
        });
      return newData;

    }
    case PORTACTION.SET_GO_BUTTON:
    {
      var newData = update(state, {goButton: {$set: action.goButton}});
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }
    case PORTACTION.SET_M2M_VENDORS: 
    {
      var newData = update(state, {m2mVendors: {$set: action.m2mVendors}});
      return newData;
    }
    case PORTACTION.SET_M2M_VENDOR_SELECT:
    {
      var newData = update(state, {m2mVendorSelect: {$set: action.m2mVendorSelect}});
      return newData;
    }
    case PORTACTION.SET_NO_CAT_LIST:
    {
      console.log('update noCatList');
      var newData = update(state, 
        { 
          noCatList: {$set: action.noCatList}
        });
      return newData;
    }
    case PORTACTION.SET_NO_CRIB_VEN:
    {
      console.log('updating noCribVen');
      var newData = update(state, 
        { 
          noCribVen: {$set: action.noCribVen}
        });
      return newData;
    }
    case PORTACTION.SET_NO_M2M_VEN:
    {
      console.log('updating noM2mVen');
      var newData = update(state, 
        { 
          noM2mVen: {$set: action.noM2mVen}
        });
      return newData;
    }
    case PORTACTION.SET_PO_CATEGORIES:
    {
      console.log('update PO Categories list');
      var newData = update(state, 
        { catTypes: {$set: action.catTypes}
        });
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }
    case PORTACTION.SET_PO_CAT_RECORDS:
    {
      console.log('update PO Cat Records list');
      var newData = update(state, 
        { catRecs: {$set: action.catRecs}
        });
      return newData;
    }
    case PORTACTION.SET_PRIMED:
    {
      console.log(`set primed`);
      var newData = update(state, 
        { 
          primed: {$set: action.primed}
        });
      return newData;

    }
    case PORTACTION.SET_REASON:
    {
      console.dir(action.reason);
      var newData = update(state, {reason: {$set: action.reason}});
      return newData;
    }
    case PORTACTION.SET_STATE:
    {
      var newData = update(state, {state: {$set: action.state}});
      return newData;
    }
    case PORTACTION.SET_VENDORS:
    {
      var newData = update(state, {vendors: {$set: action.vendors}});
      return newData;
    }
    case PORTACTION.SET_VENDOR_SELECT:
    {
      var newData = update(state, {vendorSelect: {$set: action.vendorSelect}});
      return newData;
    }
    default:
      return state;
  }
}
