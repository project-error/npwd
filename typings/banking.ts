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
}

export enum TransactionStatus {
  SUCCESS,
  INVALID_TARGET_IBAN,
  INSUFFICIENT_BALANCE,
  INVALID_NUMBER,
  GENERIC_ERROR,
}
