import { ServerPromiseResp } from '../../../../typings/common';

export interface PromiseRequest<T = any> {
  data: T;
  source: number;
}

export type PromiseEventResp<T> = (returnData: ServerPromiseResp<T>) => void;

export type CBSignature<T, P> = (reqObj: PromiseRequest<T>, resp: PromiseEventResp<P>) => void;
