import { FormattedTweet, UpdateProfileProps } from '@typings/twitter';
import { useSetFilteredTweets, useSetTweets, useSetTwitterProfile } from './state';
import { useCallback } from 'react';

interface TwitterActionProps {
  updateTweets: (tweets: FormattedTweet[]) => void;
  updateFilteredTweets: (tweets: FormattedTweet[]) => void;
  addTweet: (tweet: FormattedTweet) => void;
  deleteTweet: (tweetId: number) => void;
  updateLocalProfile: (profile: UpdateProfileProps) => void;
  localToggleLike: (tweetId: number) => void;
  updateTweetLikes: (tweetId: number, isAddLike: boolean) => void;
}

export const useTwitterActions = (): TwitterActionProps => {
  const setTweets = useSetTweets();
  const setFilteredTweets = useSetFilteredTweets();
  const setTwitterProfile = useSetTwitterProfile();

  const updateTweets = useCallback(
    (tweet: FormattedTweet[]) => {
      setTweets((curVal) => [...curVal, ...tweet]);
    },
    [setTweets],
  );

  const updateLocalProfile = useCallback(
    (profile: UpdateProfileProps) => {
      setTwitterProfile((curVal) => ({
        ...curVal,
        profile_name: profile.profile_name,
        avatar_url: profile.avatar_url,
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

  // Toggles the isLiked field
  const localToggleLike = useCallback(
    (tweetId: number) => {
      setTweets((curVal) =>
        [...curVal].map((tweet) => {
          if (tweet.id === tweetId) {
            return {
              ...tweet,
              isLiked: tweet.isLiked ? false : true,
            };
          }
          return tweet;
        }),
      );
    },
    [setTweets],
  );

  // Updates the tweet likes count, adds or subtracts depending on isAddLike
  const updateTweetLikes = useCallback((tweetId: number, isAddLike: boolean) => {
    setTweets((curVal) =>
      [...curVal].map((tweet) => {
        if (tweet.id === tweetId) {
          return {
            ...tweet,
            likes: isAddLike ? tweet.likes + 1 : tweet.likes - 1,
          };
        }
        return tweet;
      }),
    );
  },
  [setTweets],
  );

  return {
    updateTweets,
    updateFilteredTweets,
    addTweet,
    deleteTweet,
    updateLocalProfile,
    localToggleLike,
    updateTweetLikes,
  };
};