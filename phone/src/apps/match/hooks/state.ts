import { atom } from 'recoil';
import { FormattedMatch, FormattedProfile } from '../../../../../typings/match';

export const matchState = {
  profiles: atom<FormattedProfile[]>({
    key: 'profiles',
    default: null,
  }),
  errorLoadingProfiles: atom({
    key: 'errorLoadingProfiles',
    default: false,
  }),
  matches: atom<FormattedMatch[]>({
    key: 'matches',
    default: null,
  }),
  errorLoadingMatches: atom<boolean>({
    key: 'errorLoadingMatches',
    default: false,
  }),
  myProfile: atom<FormattedProfile | null>({
    key: 'myProfile',
    default: null,
  }),
  noProfileExists: atom<boolean>({
    key: 'noProfileExists',
    default: false,
  }),
};
