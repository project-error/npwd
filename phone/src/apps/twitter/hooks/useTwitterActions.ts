import { FormattedTweet, UpdateProfileProps } from '@typings/twitter';
import { useSetFilteredTweets, useSetTweets, useSetTwitterProfile } from './state';
import { useCallback } from 'react';

interface TwitterActionProps {
  updateTweets: (tweets: FormattedTweet[]) => void;
  updateFilteredTweets: (tweets: FormattedTweet[]) => void;
  addTweet: (tweet: FormattedTweet) => void;
  deleteTweet: (tweetId: number) => void;
  updateLocalProfile: (profile: UpdateProfileProps) => void;
}

export const useTwitterActions = (): TwitterActionProps => {
  const setTweets = useSetTweets();
  const setFilteredTweets = useSetFilteredTweets();
  const setTwitterProfile = useSetTwitterProfile();

  const updateTweets = useCallback(
    (tweet: FormattedTweet[]) => {
      setTweets((curVal) => [...tweet, ...curVal]);
    },
    [setTweets],
  );

  const updateLocalProfile = useCallback(
    (profile: UpdateProfileProps) => {
      setTwitterProfile((curVal) => ({
        ...curVal,
        profile_name: profile.profile_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        location: profile.location,
        job: profile.job,
      }));
    },
    [setTwitterProfile],
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
    updateLocalProfile,
  };
};
