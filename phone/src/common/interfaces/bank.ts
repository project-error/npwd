export interface Credentials {
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

