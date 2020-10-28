import { atom } from 'recoil';

export const bankState = {
  transactions: atom({
    key: 'transactionList',
    default: []
  }),
  bankModal: atom({
    key: 'modalVisibility',
    default: false,
  }),
  bankAlert: atom({
    key: 'bankAlert',
    default: false
  }),
  bankCredentials: atom({
    key: 'bankCredentails',
    default: null
  })
} 