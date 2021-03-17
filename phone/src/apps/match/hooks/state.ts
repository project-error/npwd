import { atom } from 'recoil';

export const matchState = {
  profiles: atom({
    key: 'profiles',
    default: null,
  }),
};
