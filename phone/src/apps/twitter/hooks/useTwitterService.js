import { useNuiEvent } from "../../../os/nui-events/hooks/useNuiEvent";
import { useSetRecoilState } from "recoil";

import { IMAGE_DELIMITER } from "../utils/images";
import types from "../types";
import { twitterState } from "./state";
import { useTweets } from "./useTweets";

export const useTwitterService = () => {
  const setTweets = useSetRecoilState(twitterState.tweets);
  const setCreateLoading = useSetRecoilState(twitterState.createTweetLoading);
  const setCreateSuccess = useSetRecoilState(twitterState.createTweetSuccess);

  const _setCreateSuccess = (isSuccessful) => {
    setCreateSuccess(isSuccessful === 1); // numeric 1 is returned by MySQL on successful query
    setCreateLoading(false); // on any result we should set loading to false
  };

  const _setTweets = (tweets) => {
    setTweets(
      tweets.map((tweet) => {
        return {
          ...tweet,
          // we store images in the database as a varchar field with
          // comma separated links to images
          images: tweet.images ? tweet.images.split(IMAGE_DELIMITER) : [],
        };
      })
    );
  };

  useNuiEvent(types.APP_TWITTER, "fetchTweets", _setTweets);
  useNuiEvent(types.APP_TWITTER, "createTweetLoading", setCreateLoading);
  useNuiEvent(types.APP_TWITTER, "createTweetResult", _setCreateSuccess);

  return useTweets();
};
