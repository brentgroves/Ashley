import * as PORTACTION from "../actions/PORTActionConst.js"
import * as PORTSTATE from "../actions/PORTState.js"
import update from 'react-addons-update';


export default function reducer( state = {}, action) {
  switch (action.type) {
    case PORTACTION.INIT_COMMON:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log('INIT_COMMON');
      }
      var newData = update(state, 
        { 
          primed:{$set:false}
        });
      return newData;
    }
    case PORTACTION.SET_PRIMED:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log(`set primed`);
      }
      var newData = update(state, 
        { 
          primed: {$set: action.primed}
        });
      return newData;

    }
    default:
      return state;
  }
}
