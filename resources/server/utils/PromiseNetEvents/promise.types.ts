import { FxServerRespError } from '../../../../typings/phone';
import { PromiseResponse } from './PromiseResponse';

export type BasicPrimitives = string | number | boolean;

export interface JSONLike {
  [key: string]: BasicPrimitives;
}

export type PromiseRespStatus = 'error' | 'success' | 'warning' | 'in-progress';

export interface RawDataResp {
  status: PromiseRespStatus;
  error?: FxServerRespError;
  body: JSONLike;
}

export interface PromiseRequest<T> {
  body: PromiseRequestData<T>;
  source: number;
}

export interface PromiseRequestData<T> {
  data: T;
}

export type CBSignature<ReqStruct> = (
  request: PromiseRequest<ReqStruct>,
  response: PromiseResponse,
) => Promise<void> | void;
