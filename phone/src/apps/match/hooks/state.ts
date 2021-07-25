import { atom, selector, useRecoilState } from 'recoil';
import { FormattedMatch, FormattedProfile, MatchEvents } from '../../../../../typings/match';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { MockProfilesData } from '../utils/constants';

export const matchState = {
  profiles: atom<FormattedProfile[] | any>({
    key: 'profiles',
    default: selector({
      key: 'matchDefaultProfiles',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<FormattedProfile[]>>(
            MatchEvents.GET_PROFILES,
          );
          LogDebugEvent({ action: 'fetchProfiles', data: resp.data });
          return resp.data;
        } catch (e) {
          if (isEnvBrowser()) {
            return MockProfilesData;
          }
          console.error(e);
          return [];
        }
      },
    }),
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

export const useFormattedProfiles = () => useRecoilState(matchState.profiles);
