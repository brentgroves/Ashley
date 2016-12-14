// state 1 - not primed
export const NOT_PRIMED = 'NOT_PRIMED';
// state 2 - not primed
export const PRIMED = 'PRIMED';
// state 3 - started
export const STARTED = 'STARTED';

// state 10 - Freight Carrier and packing list NOT selected for each record
export const NOT_READY_TO_REVIEW = 'NOT_READY_TO_REVIEW'

// state 20 - Freight Carrier and packing list selected for enough record(s)
export const READY_TO_REVIEW = 'READY_TO_REVIEW'

// state 30 - Review receivers
export const REVIEW_RECEIVERS = 'REVIEW_RECEIVERS'

// state 40 - Review receivers
export const GENERATE_RECEIVERS = 'GENERATE_RECEIVERS'

// state 80 - FAILED
export const UPTODATE = 'UPTODATE';
// state 85 - receivers > MAXRECIEVERS -- OUTOFRANGE
export const OUT_OF_RANGE = 'OUT_OF_RANGE';
// state 90 - FAILED
export const FAILURE = 'FAILURE';
// state 100 - Completed successfully
export const SUCCESS = 'SUCCESS';