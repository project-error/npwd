import { useNuiEvent } from 'fivem-nui-react-lib';
import { FormattedProfile, MatchEvents } from '@typings/match';
import { useMatchNotifications } from './useMatchNotifications';
import { useCallback } from 'react';
import { useMatchActions } from './useMatchActions';
import { useRecoilValueLoadable } from 'recoil';
import { matchState } from './state';
import { useLocation } from 'react-router-dom';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';

/**
 * Service to handle all NUI <> client interactions. We take
 * this opportunity to act as a middleware layer between the
 * client and the react components. Because I'm terrible with lua
 * I have given up on parsing/cleaning database query results there
 * there and have moved that logic here instead.
 */

// TODO: Bring back notifications

export const useMatchService = () => {
  const { pathname } = useLocation();
  const { visibility } = usePhoneVisibility();
  const { setNotification } = useMatchNotifications();
  const { addMatchAccount, addMatchedAccount } = useMatchActions();

  const { state: profileLoading, contents: profileContent } = useRecoilValueLoadable(
    matchState.myProfile,
  );

  const handleMatchBroadcast = ({ name }) => {
    if (visibility && pathname.includes('/match/')) {
      return;
    }

    setNotification({ name });
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
