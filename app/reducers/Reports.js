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
          openPO:{$set:{
              curPage:1,
              maxPage:3,
              poItem:[],
/*                {page:1,selected:false,visible:false,fpono: "111111", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111111", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111112", fstatus:'OPEN',fpartno:'3',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111112", fstatus:'OPEN',fpartno:'4',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111113", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111113", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111114", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111114", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111115", fstatus:'OPEN',fpartno:'3',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111115", fstatus:'OPEN',fpartno:'4',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111116", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111116", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111117", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111117", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111118", fstatus:'OPEN',fpartno:'3',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111118", fstatus:'OPEN',fpartno:'4',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111119", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111119", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
              ]
              */
            }},
          openPOPager:{$set:{done:false,failed:false}},
          progressBtn:{$set:PROGRESSBUTTON.READY},
          poStatusReport:{$set:{pdf:'',done:false,failed:false}},
          reason:{$set:''},
          state:{$set: STATE.NOT_STARTED},
          status:{$set: ''},
          sqlOpenPOVendorEmail:{$set:{done:false,failed:false}}
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
          openPO:{$set:{
              curPage:1,
              maxPage:3,
              poItem:[],
/*              [
                {page:1,selected:false,visible:false,fpono: "111111", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111111", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111112", fstatus:'OPEN',fpartno:'3',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111112", fstatus:'OPEN',fpartno:'4',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111113", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111113", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:1,selected:false,visible:false,fpono: "111114", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111114", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111115", fstatus:'OPEN',fpartno:'3',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111115", fstatus:'OPEN',fpartno:'4',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111116", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111116", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:2,selected:false,visible:false,fpono: "111117", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111117", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111118", fstatus:'OPEN',fpartno:'3',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111118", fstatus:'OPEN',fpartno:'4',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111119", fstatus:'OPEN',fpartno:'1',fordqty: 1, frcvqty:1},
                {page:3,selected:false,visible:false,fpono: "111119", fstatus:'OPEN',fpartno:'2',fordqty: 1, frcvqty:1},
              ]*/
            }},
          openPOPager:{done:false,failed:false},
          progressBtn:{$set:PROGRESSBUTTON.READY},
          poStatusReport:{$set:{pdf:'',done:false,failed:false}},
          reason:{$set:''},
          status:{$set: ''},
          sqlOpenPOVendorEmail:{$set:{done:false,failed:false}}
        });
      return newData;
    }


    case ACTION.OPENPO_PAGER_FAILED:
    {
      var openPOPager = state.openPOPager;
      openPOPager.failed=action.failed;
      var newData = update(state, {openPOPager: {$set: openPOPager}});
      return newData;
    }

    case ACTION.OPENPO_PAGER_DONE:
    {
      var openPOPager = state.openPOPager;
      openPOPager.done=action.done;
      var newData = update(state, {openPOPager: {$set: openPOPager}});
      return newData;
    }

    
    case ACTION.SET_OPENPO_CURPAGE:
    {
      var openPO = state.openPO;
      openPO.curPage=action.curPage;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }


    case ACTION.SET_OPENPO_MAXPAGE:
    {
      var openPO = state.openPO;
      openPO.maxPage = action.maxPage;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }

    case ACTION.SET_OPENPO_NEXTPAGE:
    {
      var openPO = state.openPO;
      var curPage = state.openPO.curPage;
      var maxPage = state.openPO.maxPage;
      if (maxPage>curPage){
        curPage=curPage+1;
      }else{
        curPage=curPage;
      }
      openPO.curPage=curPage;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }

    case ACTION.SET_OPENPO_POITEM:
    {
      var openPO = state.openPO;
      openPO.poItem = action.poItem;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }

    case ACTION.SET_OPENPO_PREVPAGE:
    {
      var openPO = state.openPO;
      var curPage = state.openPO.curPage;
      if(1>=curPage){
        curPage=1;
      }else{
        curPage=curPage-1;
      }
      openPO.curPage=curPage;
      var newData = update(state, {openPO: {$set: openPO}});
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
      if ('development'==process.env.NODE_ENV) {
        console.log(`progressBtn=>${action.progressBtn}`);
      }

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
      if ('development'==process.env.NODE_ENV) {
        console.log(`state=>${action.state}`);
      }
      var newData = update(state, {state: {$set: action.state}});
      return newData;
    }
    case ACTION.SET_STATUS:
    {
      var newData = update(state, {status: {$set: action.status}});
      return newData;
    }

    case ACTION.SQL_OPENPO_VENDOR_EMAIL_FAILED:
    {
      var sqlOpenPOVendorEmail = state.sqlOpenPOVendorEmail;
      sqlOpenPOVendorEmail.failed=action.failed;
      var newData = update(state, {sqlOpenPOVendorEmail: {$set: sqlOpenPOVendorEmail}});
      return newData;
    }

    case ACTION.SQL_OPENPO_VENDOR_EMAIL_DONE:
    {
      var sqlOpenPOVendorEmail = state.sqlOpenPOVendorEmail;
      sqlOpenPOVendorEmail.done=action.done;
      var newData = update(state, {sqlOpenPOVendorEmail: {$set: sqlOpenPOVendorEmail}});
      return newData;
    }


    case ACTION.TOGGLE_OPEN_PO_SELECTED:
    {
      var openPO = state.openPO;
      var poItem = state.openPO.poItem;
      var poNumber = action.poNumber;

      if ('development'==process.env.NODE_ENV) {
        console.log(`ACTION.TOGGLE_OPEN_PO_SELECTED.top()=>`);
//        console.log(`this.props.setStyle=>`);
//        console.dir(setStyle);
      }

      var poItemNew = _.map(poItem).map(function(x){
        var newSelected;
        if(poNumber==x.poNumber){
          newSelected=!x.selected;
        }else{
          newSelected=x.selected;
        }
        var poItemAdd = _.assign(x, {'selected':newSelected});
        return poItemAdd; 
      });

      openPO.poItem=poItemNew;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }

/// 
/// 
/////////////////
    default:
      return state;

  }

}
