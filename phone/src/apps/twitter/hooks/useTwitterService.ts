import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import { useNuiEvent } from 'fivem-nui-react-lib';
import { IMAGE_DELIMITER } from '../utils/images';
import { APP_TWITTER } from '../utils/constants';
import { twitterState, useTwitterProfileValue } from './state';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTwitterNotifications } from './useTwitterNotifications';
import { useTranslation } from 'react-i18next';
import { Tweet, FormattedTweet, Profile, TwitterEvents } from '../../../../../typings/twitter';
import { useCurrentTwitterPage } from './useCurrentTwitterPage';
import { useTwitterActions } from './useTwitterActions';
import { processBroadcastedTweet, processTweet } from '../utils/tweets';

/**
 * Service to handle all NUI <> client interactions. We take
 * this opportunity to act as a middleware layer between the
 * client and the react components. Because I'm terrible with lua
 * I have given up on parsing/cleaning database query results there
 * there and have moved that logic here instead.
 */
export const useTwitterService = () => {
  const { addAlert } = useSnackbar();
  const { setNotification } = useTwitterNotifications();
  const { t } = useTranslation();
  const { addTweet } = useTwitterActions();

  const profile = useTwitterProfileValue();
  const setUpdateProfileLoading = useSetRecoilState(twitterState.updateProfileLoading);
  const { pageId } = useCurrentTwitterPage();
  const [currentTweets, setTweets] = useRecoilState(twitterState.tweets);
  const setFilteredTweets = useSetRecoilState(twitterState.filteredTweets);
  const setCreateLoading = useSetRecoilState(twitterState.createTweetLoading);
  const setDefaultProfileNames = useSetRecoilState(twitterState.defaultProfileNames);

  const _setFilteredTweets = (tweets) => {
    setFilteredTweets(tweets.map(processTweet));
  };

  /*useEffect(() => {
    fetchNui<Tweet[], { pageId: number }>(TwitterEvents.FETCH_TWEETS, { pageId }).then((resp) => {
      setTweets(resp.map(processTweet));
    });
  }, [pageId, setTweets]);*/
  //needs to be tied to the inf scroll component that updates the pageId state using the wrapped hook

  // these tweets are coming directly from other player clients
  const handleTweetBroadcast = useCallback(
    (tweet: Tweet) => {
      setNotification(tweet);
      const processedTweet = processBroadcastedTweet(tweet, profile);

      addTweet(processedTweet);
    },
    [addTweet, setNotification, profile],
  );

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  // TODO: Remove TwitterEvents.GET_OR_CREATE_PROFILE listener
  /*useNuiEvent(APP_TWITTER, TwitterEvents.GET_OR_CREATE_PROFILE, setProfile);*/
  useNuiEvent(APP_TWITTER, TwitterEvents.GET_OR_CREATE_PROFILE_NULL, setDefaultProfileNames);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_PROFILE_RESULT, handleAddAlert);
  useNuiEvent(APP_TWITTER, TwitterEvents.UPDATE_PROFILE_LOADING, setUpdateProfileLoading);
  useNuiEvent(APP_TWITTER, TwitterEvents.UPDATE_PROFILE_RESULT, handleAddAlert);
  // useNuiEvent(APP_TWITTER, TwitterEvents.FETCH_TWEETS, _setTweets);
  useNuiEvent(APP_TWITTER, TwitterEvents.FETCH_TWEETS_FILTERED, _setFilteredTweets);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_LOADING, setCreateLoading);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_RESULT, handleAddAlert);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_BROADCAST, handleTweetBroadcast);
  useNuiEvent(APP_TWITTER, TwitterEvents.RETWEET_EXISTS, handleAddAlert);
};
