import { useRecoilState, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import { useNuiEvent } from 'fivem-nui-react-lib';
import { IMAGE_DELIMITER } from '../utils/images';
import { APP_TWITTER } from '../utils/constants';
import { twitterState } from './state';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTwitterNotifications } from './useTwitterNotifications';
import { useTranslation } from 'react-i18next';
import { Tweet, FormattedTweet, Profile, TwitterEvents } from '../../../../../typings/twitter';

/**
 * Perform all necessary processing/transforms from the raw database
 * data to what the frontend expects
 * @param {object} tweet - full JSON returned from the server/database
 */
function processTweet(tweet: Tweet): FormattedTweet {
  // we store images in the database as a varchar field with
  // comma separated links to images, so here we split them
  // back into their distinct members
  const imageLinks = tweet.images ? tweet.images.split(IMAGE_DELIMITER) : [];
  const images = imageLinks.map((link) => ({ id: uuidv4(), link }));
  return { ...tweet, images };
}

/**
 * in the case a tweet is broadcasted we can make some assumptions
 * that it is brand new and hasn't been liked. We should also need
 * to overwrite isMine since that will be true (sourced from another
 * player's tweet)
}
 * @param tweet - tweet to process
 * @param playerIdentifier - the current player's identifier
 * @returns Formatted Tweet
 */
function processBroadcastedTweet(tweet: Tweet, profile: Profile): FormattedTweet {
  const processedTweet = processTweet(tweet);
  const isLiked = false;
  const isMine = profile?.identifier === tweet.identifier;
  return { ...processedTweet, isMine, isLiked };
}

/**
 * Service to handle all NUI <> client interactions. We take
 * this opportunity to act as a middleware layer between the
 * client and the react components. Because I'm terrible with lua
 * I have given up on parsing/cleaning database query results there
 * there and have moved that logic here instead.
 */
export const useTwitterService = () => {
  const { addAlert } = useSnackbar();
  const { setNotification } = useTwitterNotifications();
  const [t] = useTranslation();

  const [profile, setProfile] = useRecoilState<Profile>(twitterState.profile);
  const setUpdateProfileLoading = useSetRecoilState(twitterState.updateProfileLoading);

  const [currentTweets, setTweets] = useRecoilState(twitterState.tweets);
  const setFilteredTweets = useSetRecoilState(twitterState.filteredTweets);
  const setCreateLoading = useSetRecoilState(twitterState.createTweetLoading);
  const setDefaultProfileNames = useSetRecoilState(twitterState.defaultProfileNames);

  const _setTweets = (tweets) => {
    setTweets(tweets.map(processTweet));
  };
  const _setFilteredTweets = (tweets) => {
    setFilteredTweets(tweets.map(processTweet));
  };

  // these tweets are coming directly from other player clients
  const handleTweetBroadcast = (tweet: Tweet) => {
    setNotification(tweet);
    const processedTweet = processBroadcastedTweet(tweet, profile);
    const updatedTweets = [processedTweet].concat(currentTweets);
    setTweets(updatedTweets);
  };

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent(APP_TWITTER, TwitterEvents.GET_OR_CREATE_PROFILE, setProfile);
  useNuiEvent(APP_TWITTER, TwitterEvents.GET_OR_CREATE_PROFILE_NULL, setDefaultProfileNames);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_PROFILE_RESULT, handleAddAlert);
  useNuiEvent(APP_TWITTER, TwitterEvents.UPDATE_PROFILE_LOADING, setUpdateProfileLoading);
  useNuiEvent(APP_TWITTER, TwitterEvents.UPDATE_PROFILE_RESULT, handleAddAlert);
  useNuiEvent(APP_TWITTER, TwitterEvents.FETCH_TWEETS, _setTweets);
  useNuiEvent(APP_TWITTER, TwitterEvents.FETCH_TWEETS_FILTERED, _setFilteredTweets);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_LOADING, setCreateLoading);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_RESULT, handleAddAlert);
  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_BROADCAST, handleTweetBroadcast);
  useNuiEvent(APP_TWITTER, TwitterEvents.RETWEET_EXISTS, handleAddAlert);
};
