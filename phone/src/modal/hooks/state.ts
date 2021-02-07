import { atom } from 'recoil';

export const callerState = {
  currentCall: atom({
    key: 'currentCall',
    default: null
  }),
  callModal: atom({
    key: 'callingModal',
    default: true
  }),
  callDuration: atom({
    key: 'callDuration',
    default: {ms: 0, s: 0, m: 0, h: 0}
  })
};
