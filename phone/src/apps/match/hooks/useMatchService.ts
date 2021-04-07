import { useSetRecoilState } from 'recoil';
import { matchState } from './state';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { useNuiEvent } from 'fivem-nui-react-lib';
import { Profile, FormattedProfile, Match, MatchEvents } from '../../../../../typings/match';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';

export const useMatchService = () => {
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();
  const setNoProfileExists = useSetRecoilState(matchState.noProfileExists);
  const setProfiles = useSetRecoilState(matchState.profiles);
  const setProfile = useSetRecoilState(matchState.myProfile);
  const setMatches = useSetRecoilState(matchState.matches);
  const setErrorLoadingMatches = useSetRecoilState(matchState.errorLoadingMatches);
  const setErrorLoadingProfiles = useSetRecoilState(matchState.errorLoadingProfiles);

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(message),
      type,
    });
  };

  function formatProfile(profile: Profile): FormattedProfile | null {
    return {
      ...profile,
      tagList: profile.tags.split(',').filter((t) => t), // remove any empty tags
      lastActiveFormatted: dayjs.unix(profile.lastActive).format(t('DATE_TIME_FORMAT')),
      viewed: false,
    };
  }

  const _setProfiles = (profiles: Profile[]): void => {
    setProfiles(profiles.map(formatProfile));
  };
  const _setProfile = (profile: Profile) => {
    if (!profile) {
      setNoProfileExists(true);
    } else {
      setNoProfileExists(false);
      setProfile(formatProfile(profile));
    }
  };
  const _handleGetProfilesFailed = (alert: IAlert): void => {
    handleAddAlert(alert);
    setErrorLoadingProfiles(true);
  };

  const _setMatches = (matches: Match[]): void => {
    setMatches(
      matches.map((match) => ({
        ...match,
        tagList: match.tags.split(',').filter((t) => t), // remove any empty tags
        lastActiveFormatted: dayjs.unix(match.lastActive).format(t('DATE_TIME_FORMAT')),
        matchedAtFormatted: dayjs.unix(match.matchedAt).format(t('DATE_TIME_FORMAT')),
      })),
    );
  };

  const _handleGetMatchesFailed = (alert: IAlert): void => {
    handleAddAlert(alert);
    setErrorLoadingMatches(true);
  };

  const _handleUpdateProfile = (profile: Profile) => {
    _setProfile(profile);
    handleAddAlert({ message: 'APPS_MATCH_UPDATE_PROFILE_SUCCEEDED', type: 'info' });
  };

  useNuiEvent('MATCH', MatchEvents.GET_PROFILES_SUCCESS, _setProfiles);
  useNuiEvent('MATCH', MatchEvents.GET_PROFILES_FAILED, _handleGetProfilesFailed);
  useNuiEvent('MATCH', MatchEvents.GET_MY_PROFILE_SUCCESS, _setProfile);
  useNuiEvent('MATCH', MatchEvents.GET_MY_PROFILE_FAILED, handleAddAlert);
  useNuiEvent('MATCH', MatchEvents.GET_MATCHES_SUCCESS, _setMatches);
  useNuiEvent('MATCH', MatchEvents.GET_MATCHES_FAILED, _handleGetMatchesFailed);
  useNuiEvent('MATCH', MatchEvents.SAVE_LIKES_FAILED, handleAddAlert);
  useNuiEvent('MATCH', MatchEvents.NEW_MATCH, handleAddAlert);
  useNuiEvent('MATCH', MatchEvents.UPDATE_MY_PROFILE_SUCCESS, _handleUpdateProfile);
  useNuiEvent('MATCH', MatchEvents.UPDATE_MY_PROFILE_FAILED, handleAddAlert);
  useNuiEvent('MATCH', MatchEvents.CREATE_MY_PROFILE_SUCCESS, _handleUpdateProfile);
  useNuiEvent('MATCH', MatchEvents.CREATE_MY_PROFILE_FAILED, handleAddAlert);
  return {};
};
