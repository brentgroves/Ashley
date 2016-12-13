import * as CHK from "../actions/ChkConst.js"
import * as GRACTION from "../actions/GRConst.js"
import * as GRSTATE from "../actions/GRState.js"
import * as PROGRESSBUTTON from "../actions/ProgressButtonConst.js"
import update from 'react-addons-update';


export default function reducer( state = {}, action) {
  switch (action.type) {
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
    case GRACTION.FINISH_DONE:
    {
      var bpGRFinish = state.bpGRFinish;
      bpGRFinish.done=action.done;
      var newData = update(state, {bpGRFinish: {$set: bpGRFinish}});
      return newData;
    }
    case GRACTION.FINISH_FAILED:
    {
      var bpGRFinish = state.bpGRFinish;
      bpGRFinish.failed=action.failed;
      var newData = update(state, {bpGRFinish: {$set: bpGRFinish}});
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


    case GRACTION.LOG_ENTRY_LAST_DONE:
    {
      var bpGRGetLogEntryLast = state.bpGRGetLogEntryLast;
      bpGRGetLogEntryLast.done=action.done;
      var newData = update(state, {bpGRGetLogEntryLast: {$set: bpGRGetLogEntryLast}});
      return newData;
    }
    case GRACTION.LOG_ENTRY_LAST_FAILED:
    {
      var bpGRGetLogEntryLast = state.bpGRGetLogEntryLast;
      bpGRGetLogEntryLast.failed=action.failed;
      var newData = update(state, {bpGRGetLogEntryLast: {$set: bpGRGetLogEntryLast}});
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

    case GRACTION.LOG_STEP_SET_DONE:
    {
      var bpGRLogStepSet = state.bpGRLogStepSet;
      bpGRLogStepSet.done=action.done;
      var newData = update(state, {bpGRLogStepSet: {$set: bpGRLogStepSet}});
      return newData;
    }
    case GRACTION.LOG_STEP_SET_FAILED:
    {
      var bpGRLogStepSet = state.bpGRLogStepSet;
      bpGRLogStepSet.failed=action.failed;
      var newData = update(state, {bpGRLogStepSet: {$set: bpGRLogStepSet}});
      return newData;
    }

    case GRACTION.INIT:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log('GR_INIT');
      }
      var newData = update(state, 
        { 
          bpGRFinish:{$set:{done:false,failed:false}},
          bpGRGenReceivers:{$set:{done:false,failed:false}},
          bpGRGetLogEntryLast:{$set:{done:false,failed:false}},
          bpGRLogStepSet:{$set:{done:false,failed:false}},
          bpGRPOStatusUpdate:{$set:{done:false,failed:false}},
          bpGRReceiverCount:{$set:{done:false,failed:false}},
          bpGRReceiversCribDelete:{$set:{done:false,failed:false}},
          bpGRRCItemDelete:{$set:{done:false,failed:false}},
          bpGRRCMastDelete:{$set:{done:false,failed:false}},
          bpGRSetCurrentReceiver:{$set:{done:false,failed:false}},
          bpGRTransDelete:{$set:{done:false,failed:false}},
          bpGRTransInsert:{$set:{done:false,failed:false}},
          chk0: {$set: CHK.UNKNOWN},
          closePOsReceived:{$set:{done:false,failed:false}},
          currentReceiver:{$set:0},
          goButton:{$set:PROGRESSBUTTON.READY},
          logInsert:{$set:{done:false,failed:false}},
          logEntryLast:{$set:[{}]},
          logId:{$set:0},
          receiverCount:{$set:0},
          rcitem:{$set:[{}]},
          rcitemInsert:{$set:{done:false,failed:false}},
          rcitemUpdate:{$set:{done:false,failed:false}},
          rcmast:{$set:[{}]},
          rcmastInsert:{$set:{done:false,failed:false}},
          rcmastRange:{$set:{start:0,end:0}},
          rcvJoin:{$set:[{}]},
          rollback:{$set:{done:false,failed:false}},
          reason:{$set:''},
          shipVia:{$set:[{}]},
          shipViaQry:{$set:{done:false,failed:false}},
          sqlExec:{$set:{done:false,failed:false}},
          state:{$set: GRSTATE.NOT_PRIMED},
          status:{$set: ''}
        });
      return newData;
    }
    
    case GRACTION.PO_STATUS_UPDATE_DONE:
    {
      var bpGRPOStatusUpdate = state.bpGRPOStatusUpdate;
      bpGRPOStatusUpdate.done=action.done;
      var newData = update(state, {bpGRPOStatusUpdate: {$set: bpGRPOStatusUpdate}});
      return newData;
    }
    case GRACTION.PO_STATUS_UPDATE_FAILED:
    {
      var bpGRPOStatusUpdate = state.bpGRPOStatusUpdate;
      bpGRPOStatusUpdate.failed=action.failed;
      var newData = update(state, {bpGRPOStatusUpdate: {$set: bpGRPOStatusUpdate}});
      return newData;
    }
    case GRACTION.RCITEM_DELETE_DONE:
    {
      var bpGRRCItemDelete = state.bpGRRCItemDelete;
      bpGRRCItemDelete.done=action.done;
      var newData = update(state, {bpGRRCItemDelete: {$set: bpGRRCItemDelete}});
      return newData;
    }
    case GRACTION.RCITEM_DELETE_FAILED:
    {
      var bpGRRCItemDelete = state.bpGRRCItemDelete;
      bpGRRCItemDelete.failed=action.failed;
      var newData = update(state, {bpGRRCItemDelete: {$set: bpGRRCItemDelete}});
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

    case GRACTION.RCMAST_DELETE_DONE:
    {
      var bpGRRCMastDelete = state.bpGRRCMastDelete;
      bpGRRCMastDelete.done=action.done;
      var newData = update(state, {bpGRRCMastDelete: {$set: bpGRRCMastDelete}});
      return newData;
    }
    case GRACTION.RCMAST_DELETE_FAILED:
    {
      var bpGRRCMastDelete = state.bpGRRCMastDelete;
      bpGRRCMastDelete.failed=action.failed;
      var newData = update(state, {bpGRRCMastDelete: {$set: bpGRRCMastDelete}});
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

    case GRACTION.RECEIVERS_CRIB_DELETE_DONE:
    {
      var bpGRReceiversCribDelete = state.bpGRReceiversCribDelete;
      bpGRReceiversCribDelete.done=action.done;
      var newData = update(state, {bpGRReceiversCribDelete: {$set: bpGRReceiversCribDelete}});
      return newData;
    }
    case GRACTION.RECEIVERS_CRIB_DELETE_FAILED:
    {
      var bpGRReceiversCribDelete = state.bpGRReceiversCribDelete;
      bpGRReceiversCribDelete.failed=action.failed;
      var newData = update(state, {bpGRReceiversCribDelete: {$set: bpGRReceiversCribDelete}});
      return newData;
    }

    case GRACTION.ROLLBACK_DONE:
    {
      var rollback = state.rollback;
      rollback.done=action.done;
      var newData = update(state, {rollback: {$set: rollback}});
      return newData;
    }
    case GRACTION.ROLLBACK_FAILED:
    {
      var rollback = state.rollback;
      rollback.failed=action.failed;
      var newData = update(state, {rollback: {$set: rollback}});
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

    case GRACTION.SET_LOG_ENTRY_LAST:
    {
      if ('development'==process.env.NODE_ENV) {
        console.log(`set logEntryLast`);
      }
      var newData = update(state, {logEntryLast: {$set: action.logEntryLast}});
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
    case GRACTION.SET_RCVJOIN:
    {
      var newData = update(state, {rcvJoin: {$set: action.rcvJoin}});
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

    case GRACTION.TRANS_DELETE_DONE:
    {
      var bpGRTransDelete = state.bpGRTransDelete;
      bpGRTransDelete.done=action.done;
      var newData = update(state, {bpGRTransDelete: {$set: bpGRTransDelete}});
      return newData;
    }
    case GRACTION.TRANS_DELETE_FAILED:
    {
      var bpGRTransDelete = state.bpGRTransDelete;
      bpGRTransDelete.failed=action.failed;
      var newData = update(state, {bpGRTransDelete: {$set: bpGRTransDelete}});
      return newData;
    }


    case GRACTION.TRANS_INSERT_DONE:
    {
      var bpGRTransInsert = state.bpGRTransInsert;
      bpGRTransInsert.done=action.done;
      var newData = update(state, {bpGRTransInsert: {$set: bpGRTransInsert}});
      return newData;
    }
    case GRACTION.TRANS_INSERT_FAILED:
    {
      var bpGRTransInsert = state.bpGRTransInsert;
      bpGRTransInsert.failed=action.failed;
      var newData = update(state, {bpGRTransInsert: {$set: bpGRTransInsert}});
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
