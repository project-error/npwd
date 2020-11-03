export interface Credentials {
  name: string;
  balance: number;
}

export interface Transfer {
  targetID: number;
  amount: number;
  message: string;
}

