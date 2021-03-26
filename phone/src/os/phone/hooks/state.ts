import { atom } from 'recoil';

export const phoneState = {
  visibility: atom({
    key: 'phoneVisibility',
    default: false,
  }),
  phoneConfig: atom({
    key: 'phoneConfig',
    default: undefined,
  }),
  phoneReady: atom({
    key: 'phoneReady',
    default: false,
  }),
  phoneTime: atom({
    key: 'phoneTime',
    default: null,
  }),
};
