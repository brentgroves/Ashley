import * as CHK from "../actions/ChkConst.js"
import * as GRACTION from "../actions/GRConst.js"
import * as GRSTATE from "../actions/GRState.js"
import * as PROGRESSBUTTON from "../actions/ProgressButtonConst.js"
import update from 'react-addons-update';


export default function reducer( state = {}, action) {
  switch (action.type) {
    case GRACTION.CLOSE_POS_RECEIVED_DONE:
    {
      var closePOsReceived = state.closePOsReceived;
      closePOsReceived.done=action.done;
      var newData = update(state, {closePOsReceived: {$set: closePOsReceived}});
      return newData;
    }
    case GRACTION.CLOSE_POS_RECEIVED_FAILED:
    {
      var closePOsReceived = state.closePOsReceived;
      closePOsReceived.failed=action.failed;
      var newData = update(state, {closePOsReceived: {$set: closePOsReceived}});
      return newData;
    }

    case GRACTION.CURRENT_RECEIVER_DONE:
    {
      var bpGRSetCurrentReceiver = state.bpGRSetCurrentReceiver;
      bpGRSetCurrentReceiver.done=action.done;
      var newData = update(state, {bpGRSetCurrentReceiver: {$set: bpGRSetCurrentReceiver}});
      return newData;
    }
    case GRACTION.CURRENT_RECEIVER_FAILED:
    {
      var bpGRSetCurrentReceiver = state.bpGRSetCurrentReceiver;
      bpGRSetCurrentReceiver.failed=action.failed;
      var newData = update(state, {bpGRSetCurrentReceiver: {$set: bpGRSetCurrentReceiver}});
      return newData;
    }

    case GRACTION.GEN_RECEIVERS_DONE:
    {
      var bpGRGenReceivers = state.bpGRGenReceivers;
      bpGRGenReceivers.done=action.done;
      var newData = update(state, {bpGRGenReceivers: {$set: bpGRGenReceivers}});
      return newData;
    }
    case GRACTION.GEN_RECEIVERS_FAILED:
    {
      var bpGRGenReceivers = state.bpGRGenReceivers;
      bpGRGenReceivers.failed=action.failed;
      var newData = update(state, {bpGRGenReceivers: {$set: bpGRGenReceivers}});
      return newData;
    }

    case GRACTION.LOG_INSERT_DONE:
    {
      var logInsert = state.logInsert;
      logInsert.done=action.done;
      var newData = update(state, {logInsert: {$set: logInsert}});
      return newData;
    }
    case GRACTION.LOG_INSERT_FAILED:
    {
      var logInsert = state.logInsert;
      logInsert.failed=action.failed;
      var newData = update(state, {logInsert: {$set: logInsert}});
      return newData;
    }

    case GRACTION.INIT:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log('GR_INIT');
      }
      var newData = update(state, 
        { 
          bpGRGenReceivers:{$set:{done:false,failed:false}},
          bpGRReceiverCount:{$set:{done:false,failed:false}},
          finish:{$set:{done:false,failed:false}},
          bpGRSetCurrentReceiver:{$set:{done:false,failed:false}},
          chk0: {$set: CHK.UNKNOWN},
          closePOsReceived:{$set:{done:false,failed:false}},
          currentReceiver:{$set:0},
          finish:{$set:{done:false,failed:false}},
          goButton:{$set:PROGRESSBUTTON.READY},
          logInsert:{$set:{done:false,failed:false}},
          logId:{$set:0},
          receiverCount:{$set:0},
          rcitem:{$set:[{}]},
          rcitemInsert:{$set:{done:false,failed:false}},
          rcitemUpdate:{$set:{done:false,failed:false}},
          rcmast:{$set:[{}]},
          rcmastInsert:{$set:{done:false,failed:false}},
          rcmastRange:{$set:{start:0,end:0}},
          reason:{$set:''},
          shipVia:{$set:[{}]},
          shipViaQry:{$set:{done:false,failed:false}},
          sqlExec:{$set:{done:false,failed:false}},
          state:{$set: GRSTATE.NOT_PRIMED},
          status:{$set: ''}
        });
      return newData;
    }

    case GRACTION.RCITEM_INSERT_DONE:
    {
      var rcitemInsert = state.rcitemInsert;
      rcitemInsert.done=action.done;
      var newData = update(state, {rcitemInsert: {$set: rcitemInsert}});
      return newData;
    }
    case GRACTION.RCITEM_INSERT_FAILED:
    {
      var rcitemInsert = state.rcitemInsert;
      rcitemInsert.failed=action.failed;
      var newData = update(state, {rcitemInsert: {$set: rcitemInsert}});
      return newData;
    }
    case GRACTION.RCITEM_UPDATE_DONE:
    {
      var rcitemUpdate = state.rcitemUpdate;
      rcitemUpdate.done=action.done;
      var newData = update(state, {rcitemUpdate: {$set: rcitemUpdate}});
      return newData;
    }
    case GRACTION.RCITEM_UPDATE_FAILED:
    {
      var rcitemUpdate = state.rcitemUpdate;
      rcitemUpdate.failed=action.failed;
      var newData = update(state, {rcitemUpdate: {$set: rcitemUpdate}});
      return newData;
    }
    case GRACTION.RCMAST_INSERT_DONE:
    {
      var rcmastInsert = state.rcmastInsert;
      rcmastInsert.done=action.done;
      var newData = update(state, {rcmastInsert: {$set: rcmastInsert}});
      return newData;
    }
    case GRACTION.RCMAST_INSERT_FAILED:
    {
      var rcmastInsert = state.rcmastInsert;
      rcmastInsert.failed=action.failed;
      var newData = update(state, {rcmastInsert: {$set: rcmastInsert}});
      return newData;
    }

    case GRACTION.RECEIVER_COUNT_DONE:
    {
      var bpGRReceiverCount = state.bpGRReceiverCount;
      bpGRReceiverCount.done=action.done;
      var newData = update(state, {bpGRReceiverCount: {$set: bpGRReceiverCount}});
      return newData;
    }
    case GRACTION.RECEIVER_COUNT_FAILED:
    {
      var bpGRReceiverCount = state.bpGRReceiverCount;
      bpGRReceiverCount.failed=action.failed;
      var newData = update(state, {bpGRReceiverCount: {$set: bpGRReceiverCount}});
      return newData;
    }

    case GRACTION.FINISH_DONE:
    {
      var finish = state.finish;
      finish.done=action.done;
      var newData = update(state, {finish: {$set: finish}});
      return newData;
    }
    case GRACTION.FINISH_FAILED:
    {
      var finish = state.finish;
      finish.failed=action.failed;
      var newData = update(state, {finish: {$set: finish}});
      return newData;
    }

    case GRACTION.SET_LOGID:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log(`set logId`);
      }
      var newData = update(state, {logId: {$set: action.logId}});
      return newData;
    }
    case GRACTION.SET_CURRENT_RECEIVER:
    {
      var newData = update(state, {currentReceiver: {$set: action.currentReceiver}});
      return newData;
    }
    case GRACTION.SET_GO_BUTTON:
    {
      var newData = update(state, {goButton: {$set: action.goButton}});
    //  return {chk1:'failure',chk2:'failure',chk3:'unknown',chk4:'unknown',noCatList:[{}]};   
      return newData;
    }
    case GRACTION.SET_RCITEM:
    {
      var newData = update(state, {rcitem: {$set: action.rcitem}});
      return newData;
    }
    case GRACTION.SET_RCMAST:
    {
      var newData = update(state, {rcmast: {$set: action.rcmast}});
      return newData;
    }
    case GRACTION.SET_RCMAST_RANGE:
    {
      var newData = update(state, {rcmastRange: {$set: action.rcmastRange}});
      return newData;
    }
    
    case GRACTION.SET_REASON:
    {
      if ('development'==process.env.NODE_ENV) {
        console.dir(action.reason);
      }
      var newData = update(state, {reason: {$set: action.reason}});
      return newData;
    }
    case GRACTION.SET_RECEIVER_COUNT:
    {
      var newData = update(state, {receiverCount: {$set: action.receiverCount}});
      return newData;
    }
    case GRACTION.SET_SHIP_VIA:
    {
      var newData = update(state, {shipVia: {$set: action.shipVia}});
      return newData;
    }

    case GRACTION.SET_STATE:
    {
      var newData = update(state, {state: {$set: action.state}});
      return newData;
    }
    case GRACTION.SET_STATUS:
    {
      var newData = update(state, {status: {$set: action.status}});
      return newData;
    }


    case GRACTION.SHIP_VIA_DONE:
    {                        
      var shipViaQry = state.shipViaQry;
      shipViaQry.done=action.done;
      var newData = update(state, {shipViaQry: {$set: shipViaQry}});
      return newData;
    }
    case GRACTION.SHIP_VIA_FAILED:
    {
      var shipViaQry = state.shipViaQry;
      shipViaQry.failed=action.failed;
      var newData = update(state, {shipViaQry: {$set: shipViaQry}});
      return newData;
    }


    case GRACTION.SQL_EXEC_DONE:
    {
      var sqlExec = state.sqlExec;
      sqlExec.done=action.done;
      var newData = update(state, {sqlExec: {$set: sqlExec}});
      return newData;
    }
    case GRACTION.SQL_EXEC_FAILED:
    {
      var sqlExec = state.sqlExec;
      sqlExec.failed=action.failed;
      var newData = update(state, {sqlExec: {$set: sqlExec}});
      return newData;
    }
    case GRACTION.UPDATE_RCMAST_FPACKLIST:
    {
      var newData = update(state, {rcmast: {$set: action.rcmast}});
      return newData;
    }

    default:
      return state;
  }
}
