export interface Bills {
  id: number;
  target: string;
  label: string;
  amount: number;
}

export enum BillingEvents {
  GET_BILLS = 'npwd:getBills',
}
