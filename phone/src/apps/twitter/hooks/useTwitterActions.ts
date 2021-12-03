import { FormattedTweet } from '@typings/twitter';
import { useSetFilteredTweets, useSetTweets } from './state';
import { useCallback } from 'react';

interface TwitterActionProps {
  updateTweets: (tweets: FormattedTweet[]) => void;
  updateFilteredTweets: (tweets: FormattedTweet[]) => void;
  addTweet: (tweet: FormattedTweet) => void;
  deleteTweet: (tweetId: number) => void;
}

export const useTwitterActions = (): TwitterActionProps => {
  const setTweets = useSetTweets();
  const setFilteredTweets = useSetFilteredTweets();

  const updateTweets = useCallback(
    (tweet: FormattedTweet[]) => {
      setTweets((curVal) => [...tweet, ...curVal]);
    },
    [setTweets],
  );

  const updateFilteredTweets = useCallback(
    (tweets: FormattedTweet[]) => {
      setFilteredTweets(tweets);
    },
    [setFilteredTweets],
  );

  const addTweet = useCallback(
    (tweet: FormattedTweet) => {
      setTweets((curVal) => [tweet, ...curVal]);
    },
    [setTweets],
  );

  const deleteTweet = useCallback(
    (tweetId: number) => {
      setTweets((curVal) => [...curVal].filter((t) => t.id !== tweetId));
    },
    [setTweets],
  );

  return {
    updateTweets,
    updateFilteredTweets,
    addTweet,
    deleteTweet,
  };
};
