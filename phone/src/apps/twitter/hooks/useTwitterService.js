import { useSetRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

import { useNuiEvent } from "../../../os/nui-events/hooks/useNuiEvent";
import { IMAGE_DELIMITER } from "../utils/images";
import types from "../types";
import { twitterState } from "./state";
import { useTweets } from "./useTweets";

/**
 * Perform all necessary processing/transforms from the raw database
 * data to what the frontend expects
 * @param {object} tweet - full JSON returned from the server/database
 */
function processTweet(tweet) {
  // we store images in the database as a varchar field with
  // comma separated links to images, so here we split them
  // back into their distinct members
  console.log(tweet);
  const imageLinks = tweet.images ? tweet.images.split(IMAGE_DELIMITER) : [];
  console.log(imageLinks);
  const images = imageLinks.map((link) => ({ id: uuidv4(), link }));
  return { ...tweet, images };
}

export const useTwitterService = () => {
  const setTweets = useSetRecoilState(twitterState.tweets);
  const setCreateLoading = useSetRecoilState(twitterState.createTweetLoading);
  const setCreateSuccess = useSetRecoilState(twitterState.createTweetSuccess);

  const _setCreateSuccess = (isSuccessful) => {
    setCreateSuccess(isSuccessful === 1); // numeric 1 is returned by MySQL on successful query
    setCreateLoading(false); // on any result we should set loading to false
  };

  const _setTweets = (tweets) => {
    setTweets(tweets.map(processTweet));
  };

  useNuiEvent(types.APP_TWITTER, "fetchTweets", _setTweets);
  useNuiEvent(types.APP_TWITTER, "createTweetLoading", setCreateLoading);
  useNuiEvent(types.APP_TWITTER, "createTweetResult", _setCreateSuccess);

  return useTweets();
};
