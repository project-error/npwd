import { useNuiEvent } from "../../../os/nui-events/hooks/useNuiEvent";
import { useSetRecoilState } from "recoil";

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

  useNuiEvent(types.APP_TWITTER, "fetchTweets", setTweets);
  useNuiEvent(types.APP_TWITTER, "createTweetLoading", setCreateLoading);
  useNuiEvent(types.APP_TWITTER, "createTweetResult", _setCreateSuccess);

  return useTweets();
};
