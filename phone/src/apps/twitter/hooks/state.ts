import { atom } from 'recoil';
import { FormattedTweet, Tweet as ITweet } from '../../../../../typings/twitter';

export const twitterState = {
  profile: atom({
    key: 'profile',
    default: null,
  }),
  defaultProfileNames: atom({
    key: 'defaultProfileNames',
    default: null,
  }),
  tweets: atom({
    key: 'tweets',
    default: [],
  }),
  filteredTweets: atom({
    key: 'filteredTweets',
    default: [],
  }),
  showCreateTweetModal: atom({
    key: 'showCreateTweetModal',
    default: false,
  }),
  modalMessage: atom({
    key: 'modalMessage',
    default: '',
  }),
  createTweetLoading: atom({
    key: 'createTweetLoading',
    default: false,
  }),
  createTweetSuccessful: atom({
    key: 'createTweetSuccessful',
    default: null,
  }),
  updateProfileLoading: atom({
    key: 'updateProfileLoading',
    default: false,
  }),
  updateProfileSuccess: atom({
    key: 'updateProfileSuccess',
    default: null,
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
