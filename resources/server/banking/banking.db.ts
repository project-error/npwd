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
    const result = (await DbInterface.fetch<Account[]>(query, ['$.bank', identifier]))[0];
    let listener;
    const balance = await new Promise<number>((resolve) => {
      const eventID = `npwd:setBankAmount-${Date.now()}`;
      console.log('npwd:GetBankAmount');
      listener = on(eventID, function (balance: number) {
        console.log(`triggered event handler: ${eventID}`);
        console.log(balance);
        resolve(balance);
      });
      emit('npwd:GetBankAmount', identifier, eventID);
      console.log(`starting event handler: ${eventID}`);
    });

    removeEventListener(listener, () => {});

    return <Account>{
      bank: balance,
      iban: result.iban,
    };
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
    if (identifier == null) return TransactionStatus.GENERIC_ERROR;

    if (amount <= 0) return TransactionStatus.INVALID_NUMBER;

    const GetTransactionquery = `SELECT identifier AS identifier, JSON_VALUE(accounts, "$.bank") AS bank, iban, target.target_bank, target.target_iban
                    FROM users,  
                    (SELECT identifier AS target_identifier, iban AS target_iban, JSON_VALUE(accounts, "$.bank") AS target_bank FROM users WHERE iban =?) AS target 
                    WHERE identifier = ?`;

    const result = await DbInterface.fetch<TransactionData[]>(GetTransactionquery, [
      targetIBAN,
      identifier,
    ]);

    const amountResult: number = result.length;
    if (amountResult == 0) return TransactionStatus.INVALID_TARGET_IBAN;

    const transaction: TransactionData = result[0];

    if (transaction.target_iban == null) return TransactionStatus.INVALID_TARGET_IBAN;

    if (transaction.bank < amount) return TransactionStatus.INSUFFICIENT_BALANCE;

    emit('npwd:TransferMoney', result[0].iban, result[0].target_iban, amount);
    return TransactionStatus.SUCCESS;
  }
}

const BankingDB = new _BankingDB();
export default BankingDB;
