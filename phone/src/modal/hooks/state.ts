import { atom } from 'recoil';

export const callerState = {
  currentCall: atom({
    key: 'currentCall',
    default: null
  }),
  callModal: atom({
    key: 'callingModal',
    default: false
  })
};
