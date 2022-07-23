import { Account, Transaction, TransactionData, TransactionStatus } from '../../../typings/banking';
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
  ): Promise<TransactionStatus> {
    try {
      if (identifier == null) return TransactionStatus.GENERIC_ERROR;
      if (amount <= 0) return TransactionStatus.INVALID_NUMBER;

      const GetTransactionquery = `SELECT JSON_VALUE(accounts, "$.bank") AS bank, iban, target.target_bank, target.target_iban
                    FROM users,  
                    (SELECT iban AS target_iban, JSON_VALUE(accounts, "$.bank") AS target_bank FROM users WHERE iban =?) AS target 
                    WHERE identifier = ?`;
      const result = await DbInterface.fetch<TransactionData[]>(GetTransactionquery, [
        targetIBAN,
        identifier,
      ]);
      const amountResult: number = result.length;
      if (amountResult == 0) return TransactionStatus.GENERIC_ERROR;

      const transaction: TransactionData = result[0];

      if (transaction.target_iban == null) return TransactionStatus.INVALID_TARGET_IBAN;
      if (transaction.bank < amount) return TransactionStatus.INSUFFICIENT_BALANCE;

      const upDateBankQuery = `UPDATE users SET accounts=JSON_SET(accounts, '$.bank', JSON_VALUE(accounts, '$.bank') + ? ) WHERE iban = ?;`;

      //Update Target Bank Account [[ Add Money ]]
      const updateTargetBankAccount = DbInterface.exec(upDateBankQuery, [
        amount,
        transaction.target_iban,
      ]);

      // Update Self Bank Account [[ Remove Money ]]
      const updateSelfBankAccount = DbInterface.exec(upDateBankQuery, [
        amount * -1,
        transaction.iban,
      ]);

      const addTransactionQuery = `INSERT INTO okokbanking_transactions (receiver_identifier, receiver_name, sender_identifier,  sender_name,  date,  value, type)
        SELECT receiver_identifiers.identifier as receiver_identifier, receiver_identifiers.iban as receiver_name, sender_identifiers.identifier as sender_identifier, sender_identifiers.iban as sender_name, NOW() as date, ? as value, 'transfer' as type
        FROM (SELECT * FROM users WHERE iban = ?) AS receiver_identifiers,
        (SELECT * FROM users WHERE iban = ?) AS sender_identifiers;`;

      // Add Transactions to okokTransactions
      const addTransaction = DbInterface.exec(addTransactionQuery, [
        amount,
        transaction.target_iban,
        transaction.iban,
      ]);

      await Promise.all([updateTargetBankAccount, updateSelfBankAccount, addTransaction]);
      return TransactionStatus.SUCCESS;
    } catch (e) {
      return TransactionStatus.GENERIC_ERROR;
    }
  }
}

const BankingDB = new _BankingDB();
export default BankingDB;
