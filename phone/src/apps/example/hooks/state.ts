import { atom, selector, useRecoilValue } from 'recoil';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';

export const exampleState = {
  example: atom<string>({
    key: 'exampleState',
    default: selector({
      key: 'exampleStateValue',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<any>>('someevent');
          LogDebugEvent({ action: 'some event fetch', data: resp.data });
          return resp.data;
        } catch (e) {
          if (isEnvBrowser()) {
            return 'This is mock string';
          }
          console.log(e);
          return null;
        }
      },
    }),
  }),
};

export const useExampleStringValue = () => useRecoilValue(exampleState.example);
