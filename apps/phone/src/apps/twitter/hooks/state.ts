import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FormattedTweet, Profile, Tweet, TwitterEvents } from '@typings/twitter';
import { buildRespObj } from '@utils/misc';
import { MockTweets, MockTwitterProfile } from '../utils/constants';
import { processTweet } from '../utils/tweets';
import { fetchNuiData } from '@common/query/fetch-nui-query';
import { useQueryState, useQueryStateValue, useSetQueryState } from '@common/query/query-state';

export const TWITTER_PROFILE_QUERY_KEY = ['twitter', 'profile'] as const;
export const TWEETS_QUERY_KEY = ['twitter', 'tweets'] as const;

const fetchProfile = () =>
  fetchNuiData<Profile>(
    TwitterEvents.GET_OR_CREATE_PROFILE,
    undefined,
    buildRespObj(MockTwitterProfile),
  ).catch((e) => {
    console.error(e);
    return null;
  });

const fetchTweets = async () => {
  try {
    const tweets = await fetchNuiData<Tweet[]>(
      TwitterEvents.FETCH_TWEETS,
      { pageId: 0 },
      {
        status: 'ok',
        data: MockTweets,
      },
    );

    return tweets ? tweets.map(processTweet) : [];
  } catch (e) {
    return [];
  }
};

export const twitterState = {
  profile: TWITTER_PROFILE_QUERY_KEY,
  defaultProfileNames: atom<string[]>(null),
  tweets: TWEETS_QUERY_KEY,
  filteredTweets: atom<FormattedTweet[]>([]),
  showCreateTweetModal: atom(false),
  modalMessage: atom(''),
  unreadTweetsCount: atom(0),
  tweetPageId: atom(0),
};

export const useTweetsState = () =>
  useQueryState<FormattedTweet[]>(TWEETS_QUERY_KEY, fetchTweets, []);
export const useTweetsValue = () =>
  useQueryStateValue<FormattedTweet[]>(TWEETS_QUERY_KEY, fetchTweets, []);
export const useSetTweets = () => useSetQueryState<FormattedTweet[]>(TWEETS_QUERY_KEY, []);

export const useTwitterProfile = () =>
  useQueryState<Profile>(TWITTER_PROFILE_QUERY_KEY, fetchProfile, null);
export const useTwitterProfileValue = () =>
  useQueryStateValue<Profile>(TWITTER_PROFILE_QUERY_KEY, fetchProfile, null);
export const useSetTwitterProfile = () => useSetQueryState<Profile>(TWITTER_PROFILE_QUERY_KEY, null);

export const useFilteredTweets = () => useAtom(twitterState.filteredTweets);
export const useSetFilteredTweets = () => useSetAtom(twitterState.filteredTweets);

export const useDefaultProfileNamesValue = () => useAtomValue(twitterState.defaultProfileNames);
export const useSetCreateTweetModal = () => useSetAtom(twitterState.showCreateTweetModal);
