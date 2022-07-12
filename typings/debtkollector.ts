export interface Bills {
  id: number;
  label: string;
  amount: number;
}

export enum BillingEvents {
  GET_BILLS = 'npwd:getBills',
}
