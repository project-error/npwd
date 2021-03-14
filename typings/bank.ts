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
  ADD_TRANSFER = 'phone:addTransfer',
  ADD_TRANSFER_SUCCESS = 'phone:addTransferSuccess',
  FETCH_TRANSACTIONS = 'phone:fetchAllTransactions',
  SEND_TRANSFERS = 'phone:sendTransfers',
  TRANSACTION_ALERT = 'phone:bankTransactionAlert',
  TRANSACTION_NOTIFICATION = 'phone:bankTransactionNotification',
  SEND_CREDENTIALS = 'phone:sendBankCredentials',
  GET_CREDENTIALS = 'phone:getBankCredentials',
}
