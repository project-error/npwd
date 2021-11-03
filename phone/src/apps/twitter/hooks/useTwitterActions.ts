import { FormattedTweet } from '../../../../../typings/twitter';
import { useSetTweets } from './state';
import { useCallback } from 'react';

interface TwitterActionProps {
  updateTweets: (tweets: FormattedTweet[]) => void;
  addTweet: (tweet: FormattedTweet) => void;
}

export const useTwitterActions = (): TwitterActionProps => {
  const setTweets = useSetTweets();

  const updateTweets = useCallback(
    (tweet: FormattedTweet[]) => {
      setTweets((curVal) => [...tweet, ...curVal]);
    },
    [setTweets],
  );

  const addTweet = useCallback(
    (tweet: FormattedTweet) => {
      setTweets((curVal) => [tweet, ...curVal]);
    },
    [setTweets],
  );

  return {
    updateTweets,
    addTweet,
  };
};
