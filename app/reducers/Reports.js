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
          closedPO:{$set:{
            dateHeader:{text:'Date Range',valid:true},
            dateStart:null,
            dateEnd:null,
            done:false,
            failed:false
          }},
          noReceivers:{$set:{
            dateHeader:{text:'Date Range',valid:true},
            dateStart:null,
            dateEnd:null,
            done:false,
            failed:false
          }},
          openPO:{$set:{
              curPage:1,
              dateStart:null,
              dateEnd:null,
              dateHeader:{text:'Date Range',valid:true},
              emailHeader:{text:'Email',valid:true},
              emailMRO:false,
              emailVendor:false,
              maxPage:3,
              poItem:[],
              po:[],
              select:[],
              selectDelim:[]
            }},
          openPOPager:{$set:{done:false,failed:false}},
          progressBtn:{$set:PROGRESSBUTTON.READY},
          poStatusReport:{$set:{pdf:'',done:false,failed:false}},
          reason:{$set:''},
          state:{$set: STATE.NOT_STARTED},
          status:{$set: ''},
          sqlOpenPO:{$set:{done:false,failed:false}},
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
          closedPO:{$set:{
            dateHeader:{text:'Date Range',valid:true},
            dateStart:null,
            dateEnd:null,
            done:false,
            failed:false
          }},
          noReceivers:{$set:{
            dateHeader:{text:'Date Range',valid:true},
            dateStart:null,
            dateEnd:null,
            done:false,
            failed:false
          }},
          openPO:{$set:{
              curPage:1,
              dateStart:null,
              dateEnd:null,
              dateHeader:{text:'Date Range',valid:true},
              emailHeader:{text:'Email',valid:true},
              emailMRO:false,
              emailVendor:false,
              maxPage:3,
              poItem:[],
              po:[],
              select:[],
              selectDelim:[]
            }},
          openPOPager:{$set:{done:false,failed:false}},
          progressBtn:{$set:PROGRESSBUTTON.READY},
          poStatusReport:{$set:{pdf:'',done:false,failed:false}},
          reason:{$set:''},
          status:{$set: ''},
          sqlOpenPO:{$set:{done:false,failed:false}},
          sqlOpenPOVendorEmail:{$set:{done:false,failed:false}}
        });
      return newData;
    }


    case ACTION.OPENPO_EMAIL_MRO_TOGGLE:
    {
      var openPO = state.openPO;
      if ('development'==process.env.NODE_ENV) {
        console.log('OPENPO_EMAIL_MRO_TOGGLE ${openPO.emailMRO');
      }

      openPO.emailMRO=!openPO.emailMRO;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }
    case ACTION.OPENPO_EMAIL_VENDOR_TOGGLE:
    {
      var openPO = state.openPO;
      if ('development'==process.env.NODE_ENV) {
        console.log('OPENPO_EMAIL_VENDOR_TOGGLE ${openPO.emailVendor');
      }
      openPO.emailVendor=!openPO.emailVendor;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }
    case ACTION.OPENPO_PAGER_FAILED:
    {
      var openPOPager = state.openPOPager;
      openPOPager.failed=action.failed;
      var newData = update(state, {openPOPager: {$set: openPOPager}});
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
    case ACTION.SET_CLOSEDPO_REPORT_FAILED:
    {
      var closedPO = state.closedPO;
      closedPO.failed=action.failed;
      var newData = update(state, {closedPO: {$set: closedPO}});
      return newData;
    }

    case ACTION.SET_CLOSEDPO_REPORT_DONE:
    {
      var closedPO = state.closedPO;
      closedPO.done=action.done;
      var newData = update(state, {closedPO: {$set: closedPO}});
      return newData;
    }

    case ACTION.SET_CLOSEDPO_DATE_HEADER:
    {
      var closedPO = state.closedPO;
      if ('development'==process.env.NODE_ENV) {
        console.log('SET_CLOSEDPO_DATE_HEADER ${action.dateHeader.text},${action.dateHeader.valid}');
      }

      closedPO.dateHeader=action.dateHeader;
      var newData = update(state, {closedPO: {$set: closedPO}});
      return newData;
    }

    case ACTION.SET_CLOSEDPO_DATE_END:
    {
      var closedPO = state.closedPO;
      closedPO.dateEnd=action.dateEnd;
      var newData = update(state, {closedPO: {$set: closedPO}});
      return newData;
    }

    case ACTION.SET_CLOSEDPO_DATE_START:
    {
      var closedPO = state.closedPO;
      closedPO.dateStart=action.dateStart;
      var newData = update(state, {closedPO: {$set: closedPO}});
      return newData;
    }
//////////////////////////
    case ACTION.SET_NORECEIVERS_REPORT_FAILED:
    {
      var noReceivers = state.noReceivers;
      noReceivers.failed=action.failed;
      var newData = update(state, {noReceivers: {$set: noReceivers}});
      return newData;
    }

    case ACTION.SET_NORECEIVERS_REPORT_DONE:
    {
      var noReceivers = state.noReceivers;
      noReceivers.done=action.done;
      var newData = update(state, {noReceivers: {$set: noReceivers}});
      return newData;
    }

    case ACTION.SET_NORECEIVERS_DATE_HEADER:
    {
      var noReceivers = state.noReceivers;
      if ('development'==process.env.NODE_ENV) {
        console.log('SET_NORECEIVERS_DATE_HEADER ${action.dateHeader.text},${action.dateHeader.valid}');
      }

      noReceivers.dateHeader=action.dateHeader;
      var newData = update(state, {noReceivers: {$set: noReceivers}});
      return newData;
    }

    case ACTION.SET_NORECEIVERS_DATE_END:
    {
      var noReceivers = state.noReceivers;
      noReceivers.dateEnd=action.dateEnd;
      var newData = update(state, {noReceivers: {$set: noReceivers}});
      return newData;
    }

    case ACTION.SET_NORECEIVERS_DATE_START:
    {
      var noReceivers = state.noReceivers;
      noReceivers.dateStart=action.dateStart;
      var newData = update(state, {noReceivers: {$set: noReceivers}});
      return newData;
    }

//////////////////////////////////////    
    case ACTION.SET_OPENPO_CURPAGE:
    {
      var openPO = state.openPO;
      openPO.curPage=action.curPage;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }
    case ACTION.SET_OPENPO_DATE_HEADER:
    {
      var openPO = state.openPO;
      if ('development'==process.env.NODE_ENV) {
        console.log('SET_OPENPO_DATE_HEADER ${action.dateHeader.text},${action.dateHeader.valid}');
      }

      openPO.dateHeader=action.dateHeader;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }
    case ACTION.SET_OPENPO_DATE_END:
    {
      var openPO = state.openPO;
      openPO.dateEnd=action.dateEnd;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }

    case ACTION.SET_OPENPO_DATE_START:
    {
      var openPO = state.openPO;
      openPO.dateStart=action.dateStart;
      var newData = update(state, {openPO: {$set: openPO}});
      return newData;
    }
    case ACTION.SET_OPENPO_EMAIL_HEADER:
    {
      var openPO = state.openPO;
      if ('development'==process.env.NODE_ENV) {
        console.log('SET_OPENPO_EMAIL_HEADER ${action.emailHeader.text},${action.emailHeader.valid}');
      }

      openPO.emailHeader=action.emailHeader;
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

    case ACTION.SET_OPENPO_PO:
    {
      var openPO = state.openPO;
      openPO.po = action.po;
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

    case ACTION.SET_OPENPO_SELECT:
    {
      var openPO = state.openPO;
      openPO.select = action.select;
      var select = action.select;
      const selectLen = select.length;
      var selectDelim='';
      select.map((po, i) => {
        var poDelim;
        if (selectLen === i + 1) {
          // last one
          poDelim=po
        } else {
          // not last one
          poDelim=po+','
        }
        selectDelim+= poDelim;
      });
      openPO.selectDelim = selectDelim;
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

    case ACTION.SQL_OPENPO_FAILED:
    {
      var sqlOpenPO = state.sqlOpenPO;
      sqlOpenPO.failed=action.failed;
      var newData = update(state, {sqlOpenPO: {$set: sqlOpenPO}});
      return newData;
    }

    case ACTION.SQL_OPENPO_DONE:
    {
      var sqlOpenPO = state.sqlOpenPO;
      sqlOpenPO.done=action.done;
      var newData = update(state, {sqlOpenPO: {$set: sqlOpenPO}});
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


/// 
/// 
/////////////////
    default:
      return state;

  }

}
