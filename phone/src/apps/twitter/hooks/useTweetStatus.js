import { useRecoilValue } from "recoil";

import { twitterState } from "./state";

export const useTweetStatus = () => {
  const isLoading = useRecoilValue(twitterState.createTweetLoading);
  const isSuccessful = useRecoilValue(twitterState.createTweetSuccess);
  return { isLoading, isSuccessful };
};
