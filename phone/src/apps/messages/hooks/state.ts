import { atom } from 'recoil';

export const messageState = {
  messageList: atom({
    key: 'messageList',
    default: []
  }),
  modal: atom({
    key: 'messageModal',
    default: true
  })
}