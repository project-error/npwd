import { atom } from 'recoil';

export const dialState = {
  history: atom({
    key: 'dailerHistory',
    default: null,
  }),
};
