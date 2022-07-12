import { BillingEvents, Bills } from '../../../typings/debtkollector';
import { billsLogger } from './debtkollector.utils';
import BillingService from './debtkollector.service';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNetPromise<void, Bills[]>(BillingEvents.GET_BILLS, async (reqObj, resp) => {
  BillingService.handleFetchBills(reqObj, resp).catch((e) => {
    billsLogger.error(
      `Error occurred in fetch billing list event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});
