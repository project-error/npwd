export interface PromiseRequest<T> {
  data: T;
  source: number;
}

export type PromiseEventReturnFunc = (returnData: unknown) => void;

export type CBSignature<T> = (reqObj: PromiseRequest<T>, resp: PromiseEventReturnFunc) => void;
