import { FormattedMatch, FormattedProfile, MatchEvents } from '@typings/match';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { matchState, useSetFormattedProfiles, useSetMatches } from './state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Snapshot, useRecoilCallback } from 'recoil';

const getIsMatchesLoading = (snapshot: Snapshot) =>
  snapshot.getLoadable<FormattedProfile[]>(matchState.profiles).state !== 'hasValue';

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

      fetchNui<ServerPromiseResp<boolean>>(MatchEvents.SAVE_LIKES, { id, liked }).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('MATCH.FEEDBACK.SAVE_LIKES_FAILED'),
            type: 'error',
          });
        }

        // Instead of just fetching the matches again, we might want to first format the profile to a 'Match',then to a 'FormattedMatch'
        // and then just mutate the already existing state of matches?
        // I guess that's for another time :P

        if (resp.data) {
          addAlert({
            message: t('MATCH.FEEDBACK.NEW_LIKE_FOUND'),
            type: 'info',
          });
          fetchNui<ServerPromiseResp<FormattedMatch[]>>(MatchEvents.GET_MATCHES, { page: 0 }).then(
            (resp) => {
              setMatches(resp.data);
            },
          );
        }
      });
    },
    [setProfiles, addAlert, t, setMatches],
  );

  const addMatchAccount = useRecoilCallback(
    ({ snapshot, set }) =>
      async (profile: FormattedProfile, myProfile: FormattedProfile) => {
        if (profile.identifier === myProfile.identifier) return;

        const matchesLoading = getIsMatchesLoading(snapshot);
        if (matchesLoading) return;

        set(matchState.profiles, (curVal) => [profile, ...curVal]);
      },
  );

  const addMatchedAccount = async () => {
    fetchNui<ServerPromiseResp<FormattedMatch[]>>(MatchEvents.GET_MATCHES, { page: 0 }).then(
      (resp) => {
        if (resp.status !== 'ok') return;
        setMatches(resp.data);
      },
    );
  };

  const newMatchesPage = (page: number) => {
    fetchNui<ServerPromiseResp<FormattedMatch[]>>(MatchEvents.GET_MATCHES, { page }).then(
      (resp) => {
        if (resp.status !== 'ok') return;

        setMatches(resp.data);
      },
    );
  };

  return {
    setViewed,
    addMatchAccount,
    addMatchedAccount,
    newMatchesPage,
  };
};
