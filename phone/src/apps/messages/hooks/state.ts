import { atom } from 'recoil';

export const messageState = {
  conversation: atom({
    key: 'messageConversations',
    default: null
  }),
  messageList: atom({
    key: 'messageList',
    default: []
  }),
  modal: atom({
    key: 'messageModal',
    default: true
  }),
  filter: atom({
    key: 'messageFilter',
    default: null
  })
}