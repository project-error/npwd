export interface IBankCredentials {
  name: string;
  balance: number;
}

export interface Transfer {
  id: number;
  targetID: number;
  source: string;
  type: string;
  transferAmount: number;
  message: string;
}

export interface ITransactions {
  source: number;
  type: string;
  amount: number;
}

export enum BankEvents {
  ADD_TRANSFER = 'npwd:addTransfer',
  ADD_TRANSFER_SUCCESS = 'npwd:addTransferSuccess',
  FETCH_TRANSACTIONS = 'npwd:fetchAllTransactions',
  SEND_TRANSFERS = 'npwd:sendTransfers',
  TRANSACTION_ALERT = 'npwd:bankTransactionAlert',
  TRANSACTION_NOTIFICATION = 'npwd:bankTransactionNotification',
  SEND_CREDENTIALS = 'npwd:sendBankCredentials',
  GET_CREDENTIALS = 'npwd:getBankCredentials',
}
