import { useRecoilValue, useSetRecoilState } from "recoil";
import { twitterState } from "./state";

export const useTweets = () => {
  const tweets = useRecoilValue(twitterState.tweets);
  return { tweets };
};
