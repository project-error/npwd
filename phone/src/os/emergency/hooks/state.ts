import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { ActiveCall } from '@typings/call';

export const callerState = {
  currentCall: atom<ActiveCall | null>({
    key: 'currentCallEmergency',
    default: null,
  }),
  callModal: atom<boolean>({
    key: 'callingModalEmergency',
    default: false,
  }),
  callDuration: atom({
    key: 'callDurationEmergency',
    default: { ms: 0, s: 0, m: 0, h: 0 },
  }),
};

export const useCurrentCall = () => useRecoilState(callerState.currentCall);
export const useCurrentCallValue = () => useRecoilValue(callerState.currentCall);
