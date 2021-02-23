import { atom } from 'recoil';

export const dialState = {
  history: atom({
    key: 'dialHistory',
    default: [],
  }),
};
