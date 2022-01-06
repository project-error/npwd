import { FormattedTweet, UpdateProfileProps } from '@typings/twitter';
import { twitterState, useSetFilteredTweets, useSetTweets, useSetTwitterProfile } from './state';
import { useCallback } from 'react';
import { Snapshot, useRecoilCallback } from 'recoil';

interface TwitterActionProps {
  updateTweets: (tweets: FormattedTweet[]) => void;
  updateFilteredTweets: (tweets: FormattedTweet[]) => void;
  addTweet: (tweet: FormattedTweet) => void;
  deleteTweet: (tweetId: number) => void;
  updateLocalProfile: (profile: UpdateProfileProps) => void;
}

const getIsTweetsLoading = (snapshot: Snapshot) =>
  snapshot.getLoadable<FormattedTweet[]>(twitterState.tweets).state !== 'hasValue';

export const useTwitterActions = (): TwitterActionProps => {
  const setTweets = useSetTweets();
  const setFilteredTweets = useSetFilteredTweets();
  const setTwitterProfile = useSetTwitterProfile();

  const updateTweets = useRecoilCallback(
    ({ snapshot, set }) =>
      (tweet: FormattedTweet[]) => {
        const tweetsLoading = getIsTweetsLoading(snapshot);
        if (tweetsLoading) return;

        set(twitterState.tweets, (curVal) => [...curVal, ...tweet]);
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

  const addTweet = useRecoilCallback(({ snapshot, set }) => async (tweet: FormattedTweet) => {
    const tweetsLoading = getIsTweetsLoading(snapshot);

    if (tweetsLoading) return;

    set(twitterState.tweets, (curVal) => [tweet, ...curVal]);
  });

  const deleteTweet = useRecoilCallback(
    ({ snapshot, set }) =>
      (tweetId: number) => {
        const tweetsLoading = getIsTweetsLoading(snapshot);

        if (tweetsLoading) return;

        set(twitterState.tweets, (curVal) => [...curVal].filter((t) => t.id !== tweetId));
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
