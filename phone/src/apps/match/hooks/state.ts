import { atom } from 'recoil';

export const matchState = {
  profiles: atom({
    key: 'profiles',
    default: null,
  }),
  errorLoadingProfiles: atom({
    key: 'errorLoadingProfiles',
    default: false,
  }),
  myProfile: atom({
    key: 'myProfile',
    default: null,
  }),
};
