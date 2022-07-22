export interface Account {
  bank: number;
  iban: string;
}

export interface DbAccount {
  account: Account;
}

export enum BankingEvents {
  GET_ACCOUNTS = 'npwd:getAccounts',
}
