import { useNuiEvent } from 'react-fivem-hooks';
import { NUI_BROADCAST_EVENT } from '../../../shared/network';

export const useBroadcastEvent = <T>(eventName: string, callback: (data: T | null) => void) => {
  useNuiEvent<{ data: T | null; event: string }>({
    event: NUI_BROADCAST_EVENT,
    callback: ({ data, event }) => {
      if (event === eventName) {
        callback(data);
      }
    },
    defaultValue: { data: null, event: '' },
  });
};
