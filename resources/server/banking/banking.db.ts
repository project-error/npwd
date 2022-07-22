import { Account, DbAccount } from '../../../typings/banking';
import DbInterface from '../db/db_wrapper';

export class _BankingDB {
  async fetchAccounts(identifier: string): Promise<Account> {
    if (identifier == null) return null;
    const query =
      'SELECT JSON_VALUE(accounts, "$.bank") AS bank, iban FROM users WHERE identifier = ?';
    const [results] = await DbInterface._rawExec(query, [identifier]);
    return <Account>(<Account[]>results)[0];
  }
}

const BankingDB = new _BankingDB();
export default BankingDB;
