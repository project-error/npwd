import { atom } from 'recoil';

export const exampleState = {
  example: atom({
    key: 'exampleState',
    default: null,
  }),
};
