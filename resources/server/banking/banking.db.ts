import {
  Account,
  Transaction,
  TransactionData,
  TransactionResult,
  TransactionStatus,
  TransactionType,
} from '../../../typings/banking';
import DbInterface from '../db/db_wrapper';

export class _BankingDB {
  async fetchAccounts(identifier: string): Promise<Account> {
    if (identifier == null) return null;
    const query = 'SELECT JSON_VALUE(accounts, ?) AS bank, iban FROM users WHERE identifier = ?';
    const [results] = await DbInterface._rawExec(query, ['$.bank', identifier]);
    return <Account>(<Account[]>results)[0];
  }

  async fetchTransactions(identifier: string): Promise<Transaction[]> {
    if (identifier == null) return null;
    const query = `SELECT * FROM okokbanking_transactions WHERE sender_identifier = ? OR receiver_identifier = ? ORDER BY date DESC LIMIT 30`;

    const transactions = await DbInterface.fetch<Transaction[]>(query, [identifier, identifier]);

    return transactions;
  }

  async TransferMoney(
    identifier: string,
    targetIBAN: string,
    amount: number,
  ): Promise<TransactionResult> {
    try {
      if (identifier == null)
        return {
          status: TransactionStatus.GENERIC_ERROR,
          transaction: null,
        };
      if (amount <= 0)
        return {
          status: TransactionStatus.INVALID_NUMBER,
          transaction: null,
        };

      const GetTransactionquery = `SELECT identifier AS identifier, JSON_VALUE(accounts, "$.bank") AS bank, iban, target.target_bank, target.target_iban
                    FROM users,  
                    (SELECT identifier AS target_identifier, iban AS target_iban, JSON_VALUE(accounts, "$.bank") AS target_bank FROM users WHERE iban =?) AS target 
                    WHERE identifier = ?`;
      const result = await DbInterface.fetch<TransactionData[]>(GetTransactionquery, [
        targetIBAN,
        identifier,
      ]);
      const amountResult: number = result.length;
      if (amountResult == 0)
        return {
          status: TransactionStatus.GENERIC_ERROR,
          transaction: null,
        };

      const transaction: TransactionData = result[0];

      if (transaction.target_iban == null)
        return {
          status: TransactionStatus.INVALID_TARGET_IBAN,
          transaction: null,
        };
      if (transaction.bank < amount)
        return {
          status: TransactionStatus.INSUFFICIENT_BALANCE,
          transaction: null,
        };

      return {
        status: TransactionStatus.SUCCESS,
        transaction: {
          id: null,
          value: amount,
          sender_name: result[0].iban,
          receiver_name: result[0].target_iban,
          sender_identifier: identifier,
          receiver_identifier: result[0].target_identifier,
          bank: result[0].bank,
          type: TransactionType.TRANSFER,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        status: TransactionStatus.GENERIC_ERROR,
        transaction: null,
      };
    }
  }
}

const BankingDB = new _BankingDB();
export default BankingDB;
