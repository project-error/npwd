import { atom, useSetRecoilState, selector, useRecoilValue, useRecoilState } from 'recoil';
import { FormattedTweet, Profile, Tweet, TwitterEvents } from '@typings/twitter';
import fetchNui from '@utils/fetchNui';
import { MockTweets, MockTwitterProfile } from '../utils/constants';
import { processTweet } from '../utils/tweets';

export const twitterState = {
  profile: atom<Profile | undefined>({
    key: 'profile',
    default: selector({
      key: 'defaultProfileValue',
      get: async () => {
        try {
          const profile = await fetchNui<Profile>(
            TwitterEvents.GET_OR_CREATE_PROFILE,
            undefined,
            MockTwitterProfile,
          );

          return profile;
        } catch (e) {
          console.error(e);
          return undefined;
        }
      },
    }),
  }),
  defaultProfileNames: atom({
    key: 'defaultProfileNames',
    default: [] as string[],
  }),
  tweets: atom<FormattedTweet[]>({
    key: 'tweets',
    default: selector({
      key: 'defaultTweetsValue',
      get: async () => {
        try {
          const resp = await fetchNui<Tweet[]>(
            TwitterEvents.FETCH_TWEETS,
            {
              pageId: 0,
            },
            MockTweets,
          );

          return resp?.map(processTweet) ?? [];
        } catch (e) {
          return [];
        }
      },
    }),
  }),
  filteredTweets: atom({
    key: 'filteredTweets',
    default: [] as FormattedTweet[],
  }),
  showCreateTweetModal: atom({
    key: 'showCreateTweetModal',
    default: false,
  }),
  modalMessage: atom({
    key: 'modalMessage',
    default: '',
  }),
  unreadTweetsCount: atom({
    key: 'unreadTweetsCount',
    default: 0,
  }),
  tweetPageId: atom({
    key: 'tweetPageId',
    default: 0,
  }),
};

export const useTweetsState = () => useRecoilState(twitterState.tweets);
export const useTweetsValue = () => useRecoilValue(twitterState.tweets);
export const useSetTweets = () => useSetRecoilState(twitterState.tweets);

export const useTwitterProfile = () => useRecoilState(twitterState.profile);
export const useTwitterProfileValue = () => useRecoilValue(twitterState.profile);
export const useSetTwitterProfile = () => useSetRecoilState(twitterState.profile);

export const useFilteredTweets = () => useRecoilState(twitterState.filteredTweets);
export const useSetFilteredTweets = () => useSetRecoilState(twitterState.filteredTweets);
