import PlayerService from '../players/player.service';
import { bankingLogger } from './banking.utils';
import BankingDB, { _BankingDB } from './banking.db';
import { Bills } from '../../../typings/debtkollector';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import {
  Account,
  Transaction,
  TransactionStatus,
  TranscationArguments,
} from '../../../typings/banking';

class _BankingService {
  private readonly bankingDB: _BankingDB;

  constructor() {
    this.bankingDB = BankingDB;
    bankingLogger.debug('Banking service started');
  }
  async handleFetchTransactions(req: PromiseRequest<void>, resp: PromiseEventResp<Transaction[]>) {
    try {
      // Grabs Player ID
      const identifier = PlayerService.getIdentifier(req.source);
      // Grabs transactions pertaining to the player.
      const listings = await this.bankingDB.fetchTransactions(identifier);
      resp({ data: listings, status: 'ok' });
    } catch (e) {
      bankingLogger.error(`Failed to fetch transactions, ${e.message}`, {
        source: req.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleFetchAccounts(req: PromiseRequest<void>, resp: PromiseEventResp<Account>) {
    try {
      // Grabs Player ID
      const identifier = PlayerService.getIdentifier(req.source);
      // Grabs Bills pertaining to the player.
      const listings = await this.bankingDB.fetchAccounts(identifier);
      resp({ data: listings, status: 'ok' });
    } catch (e) {
      bankingLogger.error(`Failed to fetch bank info, ${e.message}`, {
        source: req.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleBankTransfer(
    req: PromiseRequest<TranscationArguments>,
    resp: PromiseEventResp<TransactionStatus>,
  ) {
    try {
      // Grabs Player ID
      const identifier = PlayerService.getIdentifier(req.source);
      // Grabs Bills pertaining to the player.
      const listings = await this.bankingDB.TransferMoney(
        identifier,
        req.data.targetIBAN,
        req.data.amount,
      );
      resp({ data: listings, status: 'ok' });
    } catch (e) {
      bankingLogger.error(`Failed to complete transaction, ${e.message}`, {
        source: req.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }
}

const BankingService = new _BankingService();
export default BankingService;
