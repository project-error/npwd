import { atom, useAtom, useAtomValue } from 'jotai';
import { ActiveCall } from '@typings/call';

export const callerState = {
  currentCall: atom<ActiveCall | null>(null),
  callModal: atom<boolean>(false),
  callDuration: atom({ ms: 0, s: 0, m: 0, h: 0 }),
};

export const useCurrentCall = () => useAtom(callerState.currentCall);
export const useCurrentCallValue = () => useAtomValue(callerState.currentCall);
