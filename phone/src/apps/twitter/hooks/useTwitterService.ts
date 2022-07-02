import { useCallback } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import { useNuiEvent } from 'fivem-nui-react-lib';
import { APP_TWITTER } from '../utils/constants';
import { twitterState, useTweetsState } from './state';
import { useTwitterNotifications } from './useTwitterNotifications';
import { Tweet, TwitterEvents } from '@typings/twitter';
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
  const { setNotification } = useTwitterNotifications();
  const { addTweet } = useTwitterActions();
  const [tweets, setTweets] = useTweetsState();

  const { state: profileLoading, contents: profileContent } = useRecoilValueLoadable(
    twitterState.profile,
  );
  const setFilteredTweets = useSetRecoilState(twitterState.filteredTweets);

  const _setFilteredTweets = (tweets) => {
    setFilteredTweets(tweets.map(processTweet));
  };

  const handleTweetBroadcast = useCallback(
    (tweet: Tweet) => {
      if (profileLoading !== 'hasValue') return;
      if (!profileContent) return;

      if (tweets.length >= 50) {
        setTweets((curT) => curT.slice(0, -1));
      }

      setNotification(tweet);
      const processedTweet = processBroadcastedTweet(tweet, profileContent);

      addTweet(processedTweet);
    },
    [addTweet, setNotification, profileContent, profileLoading, setTweets, tweets.length],
  );

  useNuiEvent(APP_TWITTER, TwitterEvents.FETCH_TWEETS_FILTERED, _setFilteredTweets);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_BROADCAST, handleTweetBroadcast);
};
