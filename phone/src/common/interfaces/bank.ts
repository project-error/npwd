export interface Credentials {
  name: string;
  balance: number;
}

export interface Transfer {
  id: number;
  targetID: number;
  source: string;
  type: string;
  amount: number;
  message: string;
}

