import { useSetRecoilState } from 'recoil';
import { matchState } from './state';
import { useTranslation } from 'react-i18next';

import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { Profile, FormattedProfile } from '../../../../../typings/match';
import dayjs from 'dayjs';

export const useMatchService = () => {
  const { t } = useTranslation();
  const setProfiles = useSetRecoilState(matchState.profiles);
  const setProfile = useSetRecoilState(matchState.myProfile);
  // const { addAlert } = useSnackbar();
  // const { t } = useTranslation();

  // const handleAddAlert = ({ message, type }: IAlert) => {
  //   addAlert({
  //     message: t(`APPS_${message}`),
  //     type,
  //   });
  // };

  function formatProfile(profile: Profile): FormattedProfile {
    console.log(profile);
    return {
      ...profile,
      lastActive: dayjs.unix(profile.lastActive).format(t('DATE_TIME_FORMAT')),
      viewed: false,
      tagList: profile.tags.split(','),
    };
  }

  const _setProfiles = (profiles: Profile[]): void => {
    setProfiles(profiles.map(formatProfile));
  };
  const _setProfile = (profile: Profile) => setProfile(formatProfile(profile));

  useNuiEvent('MATCH', 'setProfiles', _setProfiles);
  useNuiEvent('MATCH', 'setMyProfile', _setProfile);
  return {};
};
