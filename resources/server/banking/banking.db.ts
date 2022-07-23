import { Account, TransactionData, TransactionStatus } from '../../../typings/banking';
import DbInterface from '../db/db_wrapper';

export class _BankingDB {
  async fetchAccounts(identifier: string): Promise<Account> {
    if (identifier == null) return null;
    const query = 'SELECT JSON_VALUE(accounts, ?) AS bank, iban FROM users WHERE identifier = ?';
    const [results] = await DbInterface._rawExec(query, ['$.bank', identifier]);
    return <Account>(<Account[]>results)[0];
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

      const query = `
                UPDATE users SET accounts=JSON_SET(accounts, "$.bank", JSON_VALUE(accounts, "$.bank") + ? ) WHERE iban = ?;
               
                UPDATE users SET accounts=JSON_SET(accounts, "$.bank", JSON_VALUE(accounts, "$.bank") - ? ) WHERE iban = ?;
                
                WITH receiver_identifiers AS (
                SELECT * FROM users WHERE iban = ?
                ), sender_identifiers AS (
                SELECT * FROM users WHERE iban = ?
                )
                INSERT INTO okokbanking_transactions 
                (receiver_identifier, receiver_name, sender_identifier, sender_name, date, value, type)
                VALUES 
                (receiver_identifiers.identifier, receiver_identifiers.iban, sender_identifiers.identifier, sender_identifiers.iban, NOW(), ?, "transfer")
    `;

      DbInterface.exec(query, [
        amount,
        transaction.target_iban,
        amount,
        transaction.iban,
        transaction.target_iban,
        transaction.iban,
        amount,
      ]);
    } catch (e) {
      return TransactionStatus.GENERIC_ERROR;
    }
  }
}

const BankingDB = new _BankingDB();
export default BankingDB;
