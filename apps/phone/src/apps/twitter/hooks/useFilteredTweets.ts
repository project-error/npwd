import { useFilteredTweets as useFilteredTweetsState } from './state';

export const useFilteredTweets = () => {
  const [tweets, setTweets] = useFilteredTweetsState();
  return { tweets, setTweets };
};
