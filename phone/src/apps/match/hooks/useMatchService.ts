import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { matchState } from './state';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { Profile, FormattedProfile } from '../../../../../typings/match';
import dayjs from 'dayjs';

export const useMatchService = () => {
  const { t } = useTranslation();
  const setProfiles = useSetRecoilState(matchState.profiles);
  // const { addAlert } = useSnackbar();
  // const { t } = useTranslation();

  // const handleAddAlert = ({ message, type }: IAlert) => {
  //   addAlert({
  //     message: t(`APPS_${message}`),
  //     type,
  //   });
  // };

  const _setProfiles = (profiles: Profile[]): void => {
    setProfiles(
      profiles.map((profile) => {
        return {
          ...profile,
          lastActive: dayjs.unix(profile.lastActive).format(t('DATE_TIME_FORMAT')),
          viewed: false,
        };
      }),
    );
  };

  useNuiEvent('MATCH', 'setProfiles', _setProfiles);
  return {};
};
