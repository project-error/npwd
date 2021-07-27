import { atom } from 'recoil';

export const simcardState = {
  number: atom<string | null>({
    key: 'simcardNumber',
    default: null,
  }),
};
