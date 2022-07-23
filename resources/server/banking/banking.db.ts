import { Account, DbAccount } from '../../../typings/banking';
import DbInterface from '../db/db_wrapper';

export class _BankingDB {
  async fetchAccounts(identifier: string): Promise<Account> {
    if (identifier == null) return null;
    console.log('identifier', identifier);
    const query = 'SELECT JSON_VALUE(accounts, ?) AS bank, iban FROM users WHERE identifier = ?';
    const [results] = await DbInterface._rawExec(query, ['$.bank', identifier]);
    console.log('results', results);
    console.log('finalresult', (<Account[]>results)[0]);

    return (<Account[]>results)[0];
  }
}

const BankingDB = new _BankingDB();
export default BankingDB;
