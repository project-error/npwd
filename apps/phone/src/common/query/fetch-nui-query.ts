import { ServerPromiseResp } from '@typings/common';
import fetchNui from '@utils/fetchNui';

export class NuiQueryError extends Error {
  constructor(public readonly response: ServerPromiseResp) {
    super(response.errorMsg || 'NUI request failed');
  }
}

export const fetchNuiData = async <T>(
  eventName: string,
  data?: unknown,
  mockResp?: ServerPromiseResp<T>,
): Promise<T> => {
  const resp = await fetchNui<ServerPromiseResp<T>>(eventName, data, mockResp);

  if (resp.status !== 'ok') {
    throw new NuiQueryError(resp);
  }

  return resp.data;
};
