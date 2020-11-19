import { atom } from 'recoil';

export const messageState = {
  messages: atom({
    key: 'messages',
    default: null
  }),
  activeMessageGroup: atom({
    key: 'activeMessageGroup',
    default: null
  }),
  filter: atom({
    key: 'messageFilter',
    default: null
  })
}