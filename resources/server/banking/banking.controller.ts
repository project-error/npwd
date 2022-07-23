import { bankingLogger } from './banking.utils';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import bankingService from './banking.service';
import { Account, BankingEvents } from '../../../typings/banking';

onNetPromise<void, Account>(BankingEvents.GET_ACCOUNTS, async (reqObj, resp) => {
  bankingService.handleFetchAccounts(reqObj, resp).catch((e) => {
    bankingLogger.error(
      `Error occurred in fetch billing list event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});
