import { atom } from 'recoil';

export const noteStates = {
  noteItems: atom({
    key: 'noteItem',
    default: []
  }),
  noteModal: atom({
    key: 'noteModal',
    default: true
  })
}