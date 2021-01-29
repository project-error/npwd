import { atom } from 'recoil';

export const dailerState = {
  history: atom({
    key: 'dailerHistory',
    default: null,
  }),
};
