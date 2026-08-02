import { CallEvents, CallHistoryItem } from '@typings/call';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { MockHistoryData } from '../utils/constants';
import { fetchNuiData } from '@common/query/fetch-nui-query';
import { useQueryStateValue, useSetQueryState } from '@common/query/query-state';

export const DIAL_HISTORY_QUERY_KEY = ['dialer', 'history'] as const;

const fetchHistory = async () => {
  try {
    const history = await fetchNuiData<CallHistoryItem[]>(CallEvents.FETCH_CALLS);
    LogDebugEvent({ action: CallEvents.FETCH_CALLS, data: history });
    return history;
  } catch (e) {
    if (isEnvBrowser()) {
      return MockHistoryData;
    }
    console.error(e);
    return [];
  }
};

export const dialState = {
  history: DIAL_HISTORY_QUERY_KEY,
};

export const useDialHistoryValue = () =>
  useQueryStateValue<CallHistoryItem[]>(DIAL_HISTORY_QUERY_KEY, fetchHistory, []);
export const useSetHistory = () => useSetQueryState<CallHistoryItem[]>(DIAL_HISTORY_QUERY_KEY, []);
