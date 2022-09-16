import { useNuiEvent } from 'fivem-nui-react-lib';
import { FormattedProfile, MatchEvents } from '@typings/match';
import { useCallback } from 'react';
import { useMatchActions } from './useMatchActions';
import { useRecoilValueLoadable } from 'recoil';
import { matchState } from './state';
import { useLocation } from 'react-router-dom';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import { useNotification } from '@os/new-notifications/useNotification';
import { useTranslation } from 'react-i18next';

/**
 * Service to handle all NUI <> client interactions. We take
 * this opportunity to act as a middleware layer between the
 * client and the react components. Because I'm terrible with lua
 * I have given up on parsing/cleaning database query results there
 * there and have moved that logic here instead.
 */

export const useMatchService = () => {
  const { pathname } = useLocation();
  const { visibility } = usePhoneVisibility();
  const { addMatchAccount, addMatchedAccount } = useMatchActions();
  const [t] = useTranslation();

  const { enqueueNotification } = useNotification();

  const { state: profileLoading, contents: profileContent } = useRecoilValueLoadable(
    matchState.myProfile,
  );

  const handleMatchBroadcast = ({ name }) => {
    if (visibility && pathname.includes('/match/')) {
      return;
    }

    enqueueNotification({
      appId: 'MATCH',
      content: name,
      secondaryTitle: t('MATCH.MESSAGES.NEW_MATCH'),
      notisId: 'npwd:matchBroadcast',
      path: '/match',
      keepOpen: false,
      duration: 3000,
    });
    addMatchedAccount();
  };

  const handleAccountBroadcast = useCallback(
    (profile: FormattedProfile) => {
      if (profileLoading !== 'hasValue') return;
      if (!profileContent) return;

      addMatchAccount(profile, profileContent);
    },
    [addMatchAccount, profileContent, profileLoading],
  );

  useNuiEvent('MATCH', MatchEvents.SAVE_LIKES_BROADCAST, handleMatchBroadcast);
  useNuiEvent('MATCH', MatchEvents.CREATE_MATCH_ACCOUNT_BROADCAST, handleAccountBroadcast);
};
