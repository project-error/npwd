import { useRecoilValue, useRecoilState } from "recoil";

import { twitterState } from "./state";

export const useTweetStatus = () => {
  const isLoading = useRecoilValue(twitterState.createTweetLoading);
  const [isSuccessful, setIsSuccessful] = useRecoilState(
    twitterState.createTweetSuccess
  );
  return { isLoading, isSuccessful, setIsSuccessful };
};
