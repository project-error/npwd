import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import Nui from '../../../os/nui-events/utils/Nui';
import { IMAGE_DELIMITER } from '../utils/images';
import { APP_TWITTER } from '../utils/constants';
import { twitterState } from './state';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTwitterNotifications } from './useTwitterNotifications';
import { useTranslation } from 'react-i18next';

/**
 * Perform all necessary processing/transforms from the raw database
 * data to what the frontend expects
 * @param {object} tweet - full JSON returned from the server/database
 */
function processTweet(tweet) {
  // we store images in the database as a varchar field with
  // comma separated links to images, so here we split them
  // back into their distinct members
  const imageLinks = tweet.images ? tweet.images.split(IMAGE_DELIMITER) : [];
  const images = imageLinks.map((link) => ({ id: uuidv4(), link }));
  return { ...tweet, images };
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
  const { t } = useTranslation();

  const setProfile = useSetRecoilState(twitterState.profile);
  const setUpdateProfileLoading = useSetRecoilState(twitterState.updateProfileLoading);

  const setTweets = useSetRecoilState(twitterState.tweets);
  const setFilteredTweets = useSetRecoilState(twitterState.filteredTweets);
  const setCreateLoading = useSetRecoilState(twitterState.createTweetLoading);

  const _setTweets = (tweets) => {
    setTweets(tweets.map(processTweet));
  };
  const _setFilteredTweets = (tweets) => {
    setFilteredTweets(tweets.map(processTweet));
  };

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent(APP_TWITTER, 'getOrCreateTwitterProfile', setProfile);
  useNuiEvent(APP_TWITTER, 'updateProfileLoading', setUpdateProfileLoading);
  useNuiEvent(APP_TWITTER, 'updateProfileResult', handleAddAlert);
  useNuiEvent(APP_TWITTER, 'fetchTweets', _setTweets);
  useNuiEvent(APP_TWITTER, 'fetchTweetsFiltered', _setFilteredTweets);
  useNuiEvent(APP_TWITTER, 'createTweetLoading', setCreateLoading);
  useNuiEvent(APP_TWITTER, 'createTweetResult', handleAddAlert);
  useNuiEvent(APP_TWITTER, 'createTweetBroadcast', setNotification);
  useNuiEvent(APP_TWITTER, 'phone:retweetExists', handleAddAlert);
};
