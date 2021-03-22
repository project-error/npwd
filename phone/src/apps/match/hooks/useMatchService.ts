import { useSetRecoilState } from 'recoil';
import { matchState } from './state';
import { useTranslation } from 'react-i18next';

import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { Profile, FormattedProfile, FormattedMatch, Match } from '../../../../../typings/match';
import dayjs from 'dayjs';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';

export const useMatchService = () => {
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();
  const setProfiles = useSetRecoilState(matchState.profiles);
  const setProfile = useSetRecoilState(matchState.myProfile);
  const setMatches = useSetRecoilState(matchState.matches);

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  function formatProfile(profile: Profile): FormattedProfile {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(profile.lastActive);
    console.log(dayjs(profile.lastActive));
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    return {
      ...profile,
      lastActiveFormatted: dayjs.unix(profile.lastActive).format(t('DATE_TIME_FORMAT')),
      viewed: false,
      tagList: profile.tags.split(',').filter((t) => t), // remove any empty tags
    };
  }

  const _setProfiles = (profiles: Profile[]): void => {
    setProfiles(profiles.map(formatProfile));
  };
  const _setProfile = (profile: Profile) => setProfile(formatProfile(profile));
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

  useNuiEvent('MATCH', 'phone:getMatchProfilesSuccess', _setProfiles);
  useNuiEvent('MATCH', 'phone:getMatchProfilesFailed', handleAddAlert);
  useNuiEvent('MATCH', 'phone:getMyProfileSuccess', _setProfile);
  useNuiEvent('MATCH', 'phone:getMyProfileFailed', handleAddAlert);
  useNuiEvent('MATCH', 'phone:getMatches', _setMatches);
  return {};
};
