import { useRecoilState } from "recoil";
import { twitterState } from "./state";

export const useFilteredTweets = () => {
  const [tweets, setTweets] = useRecoilState(twitterState.filteredTweets);
  return { tweets, setTweets };
};
