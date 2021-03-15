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
