interface ServerPromiseSuccessResponse<T> {
  status: 'ok';
  data?: T | undefined;
}
interface ServerPromiseErrorResponse {
  errorMsg: string;
  status: 'error';
}

export type ServerPromiseResp<T = undefined> =
  | ServerPromiseSuccessResponse<T>
  | ServerPromiseErrorResponse;
