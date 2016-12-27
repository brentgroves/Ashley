import * as ACTION from "../actions/Rpt/Const.js"
import * as STATE from "../actions/Rpt/State.js"
import * as PROGRESSBUTTON from "../actions/ProgressButtonConst.js"
import update from 'react-addons-update';


export default function reducer( state = {}, action) {
  switch (action.type) {
    case ACTION.INIT:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log('RPT_INIT');
      }
      var newData = update(state, 
        { 
          progressBtn:{$set:PROGRESSBUTTON.READY},
          poStatusReport:{$set:{pdf:'',done:false,failed:false}},
          reason:{$set:''},
          state:{$set: STATE.NOT_STARTED},
          status:{$set: ''}
        });
      return newData;
    }

    case ACTION.INIT_NO_STATE:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log('RPT_INIT_NO_STATE');
      }
      var newData = update(state, 
        { 
          progressBtn:{$set:PROGRESSBUTTON.READY},
          poStatusReport:{$set:{pdf:'',done:false,failed:false}},
          reason:{$set:''},
          status:{$set: ''}
        });
      return newData;
    }
    
    case ACTION.SET_POSTATUS_REPORT_FAILED:
    {
      var poStatusReport = state.poStatusReport;
      poStatusReport.failed=action.failed;
      var newData = update(state, {poStatusReport: {$set: poStatusReport}});
      return newData;
    }

    case ACTION.SET_POSTATUS_REPORT_DONE:
    {
      var poStatusReport = state.poStatusReport;
      poStatusReport.done=action.done;
      var newData = update(state, {poStatusReport: {$set: poStatusReport}});
      return newData;
    }

    case ACTION.SET_POSTATUS_REPORT_PDF:
    {
      var poStatusReport = state.poStatusReport;
      poStatusReport.pdf=action.pdf;
      var newData = update(state, {poStatusReport: {$set: poStatusReport}});
      return newData;
    }

    case ACTION.SET_PROGRESS_BTN:
    {
      var newData = update(state, {progressBtn: {$set: action.progressBtn}});
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }
    
    case ACTION.SET_REASON:
    {
      if ('development'==process.env.NODE_ENV) {
        console.dir(action.reason);
      }
      var newData = update(state, {reason: {$set: action.reason}});
      return newData;
    }
    case ACTION.SET_STATE:
    {
      var newData = update(state, {state: {$set: action.state}});
      return newData;
    }
    case ACTION.SET_STATUS:
    {
      var newData = update(state, {status: {$set: action.status}});
      return newData;
    }

    case ACTION.TOGGLE_OPEN_PO_SELECTED:
    {
      var openPO = state.openPO;
      var fpono = action.fpono;

      if ('development'==process.env.NODE_ENV) {
        console.log(`ACTION.TOGGLE_OPEN_PO_SELECTED.top()=>`);
//        console.log(`this.props.setStyle=>`);
//        console.dir(setStyle);
      }

      var openPONew = _.map(openPO).map(function(x){
        var newSelected;
        if(fpono==x.fpono){
          newSelected=!x.selected;
        }else{
          newSelected=x.selected;
        }
        var openPOAdd = _.assign(x, {'selected':newSelected});
        return openPOAdd; 
      });


      var newData = update(state, {openPO: {$set: openPONew}});
      return newData;
    }

    case ACTION.TOGGLE_OPEN_PO_VISIBLE:
    {
      var openPO = state.openPO;
      var fpono = action.fpono;

      if ('development'==process.env.NODE_ENV) {
        console.log(`ACTION.TOGGLE_OPEN_PO_VISIBLE.top()=>`);
//        console.log(`this.props.setStyle=>`);
//        console.dir(setStyle);
      }

      var openPONew = _.map(openPO).map(function(x){
        var newVisible;
        if(fpono==x.fpono){
          newVisible=!x.visible;
        }else{
          newVisible=x.visible;
        }
        var openPOAdd = _.assign(x, {'visible':newVisible});
        return openPOAdd; 
      });


      var newData = update(state, {openPO: {$set: openPONew}});
      return newData;
    }


/// 
/// 
/////////////////
    default:
      return state;

  }

}
