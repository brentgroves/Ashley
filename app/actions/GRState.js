// state 1 - not primed
export const NOT_PRIMED = 'NOT_PRIMED';
// state 2 - not primed
export const PRIMED = 'PRIMED';
// state 3 - started
export const STARTED = 'STARTED';

// state 4 - Receiver Limit Check
export const PREPARING_RECEIVERS = 'PREPARING_RECEIVERS';

// state 10 - Freight Carrier and packing list NOT selected for each record
export const NOT_READY_TO_REVIEW = 'NOT_READY_TO_REVIEW'

// state 20 - Freight Carrier and packing list selected for enough record(s)
export const READY_TO_REVIEW = 'READY_TO_REVIEW'

// state 30 - Pre-Review receivers
export const PRE_REVIEW_RECEIVERS = 'PRE_REVIEW_RECEIVERS'

// state 35 - Review receivers
export const REVIEW_RECEIVERS = 'REVIEW_RECEIVERS'

// state 40 - Generate receivers in Made2Manage
export const GENERATE_RECEIVERS = 'GENERATE_RECEIVERS'


// state 50 - Display PO Status report
export const DISPLAY_REPORT = 'DISPLAY_REPORT'

// state 80 - FAILED
export const UPTODATE = 'UPTODATE';
// state 85 - receivers > MAXRECIEVERS -- OUTOFRANGE
export const OUT_OF_RANGE = 'OUT_OF_RANGE';
// state 90 - FAILED
export const FAILURE = 'FAILURE';
// state 100 - Completed successfully
export const SUCCESS = 'SUCCESS';