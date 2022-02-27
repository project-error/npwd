import { FormattedMatch, MatchEvents } from '@typings/match';
import fetchNui from '@utils/fetchNui';
import { useSetFormattedProfiles, useSetMatches } from './state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useMatchActions = () => {
  const setProfiles = useSetFormattedProfiles();
  const setMatches = useSetMatches();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const setViewed = useCallback(
    (id: number, liked: boolean) => {
      setProfiles((profiles) =>
        profiles.map((profile) => {
          if (id === profile.id) return { ...profile, viewed: true, liked };
          return profile;
        }),
      );

      fetchNui<boolean>(MatchEvents.SAVE_LIKES, [{ id, liked }])
        .then((resp) => {
          // Instead of just fetching the matches again, we might want to first format the profile to a 'Match',then to a 'FormattedMatch'
          // and then just mutate the already existing state of matches?
          // I guess that's for another time :P

          if (resp) {
            addAlert({
              message: t('MATCH.FEEDBACK.NEW_LIKE_FOUND'),
              type: 'info',
            });

            fetchNui<FormattedMatch[]>(MatchEvents.GET_MATCHES).then((resp) => {
              resp && setMatches(resp);
            });
          }
        })
        .catch(() => {
          return addAlert({
            message: t('MATCH.FEEDBACK.SAVE_LIKES_FAILED'),
            type: 'error',
          });
        });
    },
    [setProfiles, addAlert, t, setMatches],
  );

  return {
    setViewed,
  };
};
