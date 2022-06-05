export interface ServerPromiseResp<T = undefined> {
  errorMsg?: string;
  status: 'ok' | 'error';
  data?: T;
}

export type Spread<T1, T2> = { [K in Exclude<keyof T1, keyof T2>]: T1[K] } & T2;
