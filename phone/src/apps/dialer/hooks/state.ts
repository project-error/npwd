import { atom, selector } from 'recoil';
import { CallEvents, CallHistoryItem } from '@typings/call';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { MockHistoryData } from '../utils/constants';

export const dialState = {
  history: atom<CallHistoryItem[]>({
    key: 'dialHistory',
    default: selector({
      key: 'dialHistoryDefault',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<CallHistoryItem[]>>(CallEvents.FETCH_CALLS);
          LogDebugEvent({ action: 'ContactsFetched', data: resp.data });
          return resp.data;
        } catch (e) {
          if (isEnvBrowser()) {
            return MockHistoryData;
          }
          console.error(e);
          return [];
        }
      },
    }),
  }),
};
