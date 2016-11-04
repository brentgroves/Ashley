import * as COMMON from "./CommonConst.js"
import { push } from 'react-router-redux';
import * as SQLPRIMEDB from "../api/SQLPrimeDB.js"


export function initCommon() {
  return {
    type: COMMON.INIT_COMMON
  };
}

export function primeDB() {
  return (dispatch,getState) => {
    var disp = dispatch;
    var getSt = getState;
    SQLPRIMEDB.sql1(disp,getSt);
  };
}


