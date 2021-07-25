import { FormattedProfile, Profile } from '../../../../../typings/match';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export const useMatchActions = () => {
  const { t } = useTranslation();

  const formatProfile = (profile: Profile): FormattedProfile | null => {
    return {
      ...profile,
      tagList: profile.tags.split(',').filter((t) => t), // remove any empty tags
      lastActiveFormatted: dayjs.unix(profile.lastActive).format(t('DATE_TIME_FORMAT')),
      viewed: false,
    };
  };

  return {
    formatProfile,
  };
};
