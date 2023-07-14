import { useCallback } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import { useNuiEvent } from 'fivem-nui-react-lib';
import { APP_TWITTER } from '../utils/constants';
import { twitterState, useTweetsState } from './state';
import { Tweet, TwitterEvents } from '@typings/twitter';
import { useTwitterActions } from './useTwitterActions';
import { processBroadcastedTweet, processTweet } from '../utils/tweets';
import { useNotification } from '@os/new-notifications/useNotification';
import { useLocation } from 'react-router-dom';

/**
 * Service to handle all NUI <> client interactions. We take
 * this opportunity to act as a middleware layer between the
 * client and the react components. Because I'm terrible with lua
 * I have given up on parsing/cleaning database query results there
 * there and have moved that logic here instead.
 */

export const useTwitterService = () => {
  const { addTweet, updateTweetLikes } = useTwitterActions();
  const [tweets, setTweets] = useTweetsState();
  const { enqueueNotification } = useNotification();
  const { pathname } = useLocation();

  const { state: profileLoading, contents: profileContent } = useRecoilValueLoadable(
    twitterState.profile,
  );
  const setFilteredTweets = useSetRecoilState(twitterState.filteredTweets);

  const _setFilteredTweets = (tweets: Tweet[]) => {
    setFilteredTweets(tweets.map(processTweet));
  };

  const addNotification = useCallback(
    (tweet: Tweet) => {
      enqueueNotification({
        appId: 'TWITTER',
        content: tweet.message,
        notisId: 'npwd:tweetBroadcast',
        secondaryTitle: tweet.profile_name,
        path: '/twitter',
        playSound: true,
      });
    },
    [enqueueNotification],
  );

  const addLikedTweetNotification = useCallback(
    (likedByProfileName: string) => {
      enqueueNotification({
        appId: 'TWITTER',
        content: `@${likedByProfileName} liked your tweet!`,
        notisId: 'npwd:tweetBroadcast',
        path: '/twitter',
      });
    },
    [enqueueNotification],
  );

  const handleTweetBroadcast = useCallback(
    (tweet: Tweet) => {
      if (profileLoading !== 'hasValue') return;
      if (!profileContent) return;

      if (tweets.length >= 50) {
        setTweets((curT) => curT.slice(0, -1));
      }

      if (!pathname.includes('/twitter')) {
        addNotification(tweet);
      }

      const processedTweet = processBroadcastedTweet(tweet, profileContent);
      addTweet(processedTweet);
    },
    [addTweet, addNotification, profileContent, profileLoading, setTweets, tweets.length, pathname],
  );

  const handleTweetLikedBroadcast = useCallback((
    {tweetId, isAddLike, likedByProfileName}: {
      tweetId: number,
      isAddLike: boolean,
      likedByProfileName: string
    }
  ) => {
    updateTweetLikes(tweetId, isAddLike);

    // Only notify when a like is added (dont notify when its removed)
    // Dont notify if you are looking at twitter
    if (isAddLike && !pathname.includes('/twitter')) {
      const likedTweet = tweets.find(tweet => tweet.id == tweetId);

      // Only notify if the user is the owner of the tweet and its not a self like
      if (likedTweet.isMine && likedTweet.profile_name !== likedByProfileName) {
        addLikedTweetNotification(likedByProfileName);
      }
    }
  }, [addLikedTweetNotification, updateTweetLikes, tweets]);

  useNuiEvent(APP_TWITTER, TwitterEvents.FETCH_TWEETS_FILTERED, _setFilteredTweets);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_BROADCAST, handleTweetBroadcast);
  useNuiEvent(APP_TWITTER, TwitterEvents.TWEET_LIKED_BROADCAST, handleTweetLikedBroadcast);
};