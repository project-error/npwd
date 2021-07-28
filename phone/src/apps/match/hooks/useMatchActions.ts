import { FormattedProfile, MatchEvents, Profile } from '../../../../../typings/match';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import { useSetFormattedProfiles } from './state';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useCallback } from 'react';

export const useMatchActions = () => {
  const { t } = useTranslation();
  const setProfiles = useSetFormattedProfiles();
  const { addAlert } = useSnackbar();

  const formatProfile = (profile: Profile): FormattedProfile | null => {
    return {
      ...profile,
      tagList: profile.tags.split(',').filter((t) => t), // remove any empty tags
      lastActiveFormatted: dayjs.unix(profile.lastActive).format(t('DATE_TIME_FORMAT')),
      viewed: false,
    };
  };

  const setViewed = useCallback(
    (id: number, liked: boolean) => {
      setProfiles((profiles) =>
        profiles.map((profile) => {
          if (id === profile.id) return { ...profile, viewed: true, liked };
          return profile;
        }),
      );

      fetchNui<ServerPromiseResp<boolean>>(MatchEvents.SAVE_LIKES, [{ id, liked }]).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: 'APPS_MATCH_SAVE_LIKES_FAILED',
            type: 'error',
          });
        }

        // Instead of just fetching the matches again, we might want to first format the profile to a 'Match',then to a 'FormattedMatch'
        // and then just mutate the already existing state of matches?
        // I guess that's for another time :P

        if (resp.data) {
          addAlert({
            message: 'APPS_MATCH_NEW_LIKE_FOUND',
            type: 'info',
          });
          fetchNui(MatchEvents.GET_MATCHES);
        }
      });
    },
    [setProfiles, addAlert],
  );

  return {
    formatProfile,
    setViewed,
  };
};
