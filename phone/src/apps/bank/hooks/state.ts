import { atom } from 'recoil';

export const bankState = {
  transactions: atom({
    key: 'transactionList',
    default: [],
  }),
  bankModal: atom({
    key: 'modalVisibility',
    default: false,
  }),
  bankCredentials: atom({
    key: 'bankCredentails',
    default: null,
  }),
  notification: atom({
    key: 'bankNotification',
    default: null,
  }),
};
