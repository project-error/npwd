export interface Account {
  bank: number;
  iban: string;
}

export interface TransactionData {
  bank: number;
  iban: string;
  target_bank: number;
  target_iban: string;
}

export interface DbAccount {
  account: Account;
}
export interface TranscationArguments {
  targetIBAN: string;
  amount: number;
}

export enum BankingEvents {
  GET_ACCOUNTS = 'npwd:getAccounts',
  TRANSFER_MONEY = 'npwd:transferMoney',
  GET_TRANSACTIONS = 'npwd:getTransactinos',
}

export enum TransactionStatus {
  SUCCESS,
  INVALID_TARGET_IBAN,
  INSUFFICIENT_BALANCE,
  INVALID_NUMBER,
  GENERIC_ERROR,
}

export interface Transaction {
  id: number;
  value: number;
  sender_name: string;
  receiver_name: string;
  type: TransactionType;
  sender_identifier: string;
  receiver_identifier: string;
}

export enum TransactionType {
  WITHDRAW = 'withdraw',
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
}
