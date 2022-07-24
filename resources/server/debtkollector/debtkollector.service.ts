import PlayerService from '../players/player.service';
import { billsLogger } from './debtkollector.utils';
import BillsDB, { _BillsDB } from './debtkollector.db';
import { Bills } from '../../../typings/debtkollector';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';

class _BillingService {
  private readonly billsDB: _BillsDB;

  constructor() {
    this.billsDB = BillsDB;
    billsLogger.debug('Garage service started');
  }
  //RegisterNuiProxy(BillingEvents.GET_BILLS);

  async handleFetchBills(req: PromiseRequest<void>, resp: PromiseEventResp<Bills[]>) {
    try {
      console.log('Debt Kollector Service was hit');
      // Grabs Player ID
      const identifier = PlayerService.getIdentifier(req.source);
      // Grabs Bills pertaining to the player.
      const listings = await this.billsDB.fetchBills(identifier);
      resp({ data: listings, status: 'ok' });
    } catch (e) {
      billsLogger.error(`Failed to fetch bills, ${e.message}`, {
        source: req.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }
}

const BillingService = new _BillingService();
export default BillingService;
