import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FormattedMatch, FormattedProfile, MatchEvents } from '@typings/match';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { MockMatchesData, MockMyProfileData, MockProfilesData } from '../utils/constants';
import { fetchNuiData } from '@common/query/fetch-nui-query';
import { useQueryState, useQueryStateValue, useSetQueryState } from '@common/query/query-state';

export const MATCH_PROFILES_QUERY_KEY = ['match', 'profiles'] as const;
export const MATCH_MATCHES_QUERY_KEY = ['match', 'matches'] as const;
export const MATCH_MY_PROFILE_QUERY_KEY = ['match', 'my-profile'] as const;

const fetchProfiles = async () => {
  try {
    const profiles = await fetchNuiData<FormattedProfile[]>(MatchEvents.GET_PROFILES);
    LogDebugEvent({ action: 'fetchProfiles', data: profiles });
    return profiles;
  } catch (e) {
    if (isEnvBrowser()) {
      return MockProfilesData;
    }
    console.error(e);
    return [];
  }
};

const fetchMatches = async () => {
  try {
    const matches = await fetchNuiData<FormattedMatch[]>(MatchEvents.GET_MATCHES, { page: 0 });
    LogDebugEvent({ action: 'fetchMatches', data: matches });
    return matches;
  } catch (e) {
    if (isEnvBrowser()) {
      return MockMatchesData;
    }
    return [];
  }
};

const fetchMyProfile = async () => {
  try {
    const profile = await fetchNuiData<FormattedProfile>(MatchEvents.GET_MY_PROFILE);
    LogDebugEvent({ action: 'fetchMyProfile', data: profile });
    return profile;
  } catch (e) {
    if (isEnvBrowser()) {
      return MockMyProfileData;
    }
    console.error(e);
    return null;
  }
};

export const matchState = {
  profiles: MATCH_PROFILES_QUERY_KEY,
  errorLoadingProfiles: atom<boolean>(false),
  matches: MATCH_MATCHES_QUERY_KEY,
  errorLoadingMatches: atom<boolean>(false),
  myProfile: MATCH_MY_PROFILE_QUERY_KEY,
  noProfileExists: atom<boolean>(false),
};

export const useFormattedProfiles = () =>
  useQueryState<FormattedProfile[]>(MATCH_PROFILES_QUERY_KEY, fetchProfiles, []);
export const useFormattedProfilesValue = () =>
  useQueryStateValue<FormattedProfile[]>(MATCH_PROFILES_QUERY_KEY, fetchProfiles, []);
export const useSetFormattedProfiles = () =>
  useSetQueryState<FormattedProfile[]>(MATCH_PROFILES_QUERY_KEY, []);

export const useMyProfile = () =>
  useQueryState<FormattedProfile | null>(MATCH_MY_PROFILE_QUERY_KEY, fetchMyProfile, null);
export const useMyProfileValue = () =>
  useQueryStateValue<FormattedProfile | null>(MATCH_MY_PROFILE_QUERY_KEY, fetchMyProfile, null);
export const useSetMyProfile = () =>
  useSetQueryState<FormattedProfile | null>(MATCH_MY_PROFILE_QUERY_KEY, null);

export const useProfileExistsValue = () => useAtomValue(matchState.noProfileExists);
export const useProfileExists = () => useAtom(matchState.noProfileExists);

export const useFormattedMatches = () =>
  useQueryState<FormattedMatch[]>(MATCH_MATCHES_QUERY_KEY, fetchMatches, []);
export const useMatchesValue = () =>
  useQueryStateValue<FormattedMatch[]>(MATCH_MATCHES_QUERY_KEY, fetchMatches, []);
export const useSetMatches = () => useSetQueryState<FormattedMatch[]>(MATCH_MATCHES_QUERY_KEY, []);

export const useErrorLoadingProfiles = () => useAtomValue(matchState.errorLoadingProfiles);
export const useErrorLoadingMatches = () => useAtomValue(matchState.errorLoadingMatches);
