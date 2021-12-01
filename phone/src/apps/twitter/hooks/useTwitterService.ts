import { useCallback } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import { useNuiEvent } from 'fivem-nui-react-lib';
import { APP_TWITTER } from '../utils/constants';
import { twitterState } from './state';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTwitterNotifications } from './useTwitterNotifications';
import { useTranslation } from 'react-i18next';
import { Tweet, TwitterEvents } from '../../../../../typings/twitter';
import { useTwitterActions } from './useTwitterActions';
import { processBroadcastedTweet, processTweet } from '../utils/tweets';

/**
 * Service to handle all NUI <> client interactions. We take
 * this opportunity to act as a middleware layer between the
 * client and the react components. Because I'm terrible with lua
 * I have given up on parsing/cleaning database query results there
 * there and have moved that logic here instead.
 */

// TODO: Bring back notifications

export const useTwitterService = () => {
  const { addAlert } = useSnackbar();
  const { setNotification } = useTwitterNotifications();
  const { t } = useTranslation();
  const { addTweet } = useTwitterActions();

  const { state: profileLoading, contents: profileContent } = useRecoilValueLoadable(
    twitterState.profile,
  );
  const setUpdateProfileLoading = useSetRecoilState(twitterState.updateProfileLoading);
  const setFilteredTweets = useSetRecoilState(twitterState.filteredTweets);
  const setCreateLoading = useSetRecoilState(twitterState.createTweetLoading);
  const setDefaultProfileNames = useSetRecoilState(twitterState.defaultProfileNames);

  const _setFilteredTweets = (tweets) => {
    setFilteredTweets(tweets.map(processTweet));
  };

  const handleTweetBroadcast = useCallback(
    (tweet: Tweet) => {
      if (profileLoading !== 'hasValue') return;

      if (!profileContent) return;

      setNotification(tweet);
      const processedTweet = processBroadcastedTweet(tweet, profileContent);

      addTweet(processedTweet);
    },
    [addTweet, setNotification, profileContent, profileLoading],
  );

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent(APP_TWITTER, TwitterEvents.GET_OR_CREATE_PROFILE_NULL, setDefaultProfileNames);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_PROFILE_RESULT, handleAddAlert);
  useNuiEvent(APP_TWITTER, TwitterEvents.UPDATE_PROFILE_LOADING, setUpdateProfileLoading);
  useNuiEvent(APP_TWITTER, TwitterEvents.UPDATE_PROFILE_RESULT, handleAddAlert);
  useNuiEvent(APP_TWITTER, TwitterEvents.FETCH_TWEETS_FILTERED, _setFilteredTweets);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_LOADING, setCreateLoading);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_RESULT, handleAddAlert);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_BROADCAST, handleTweetBroadcast);
  useNuiEvent(APP_TWITTER, TwitterEvents.RETWEET_EXISTS, handleAddAlert);
};
