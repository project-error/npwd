import { Bills, BillingEvents } from '@typings/debtkollector';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { isEnvBrowser } from '@utils/misc';
import { MockBillingData } from '../utils/constants';

export const fetchBills = async (): Promise<Bills[]> => {
  try {
    const resp = await fetchNui<ServerPromiseResp<Bills[]>>(BillingEvents.GET_BILLS);
    return resp.data;
  } catch (e) {
    if (isEnvBrowser()) return MockBillingData;
    console.error(e);
    return [];
  }
};
