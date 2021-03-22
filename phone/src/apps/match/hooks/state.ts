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
  matches: atom({
    key: 'matches',
    default: null,
  }),
  errorLoadingMatches: atom({
    key: 'errorLoadingMatches',
    default: false,
  }),
  myProfile: atom({
    key: 'myProfile',
    default: null,
  }),
  errorLoadingMyProfile: atom({
    key: 'errorLoadingMyProfile',
    default: false,
  }),
};
