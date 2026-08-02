import { useTweetsValue } from './state';

export const useTweets = () => {
  const tweets = useTweetsValue();
  return { tweets };
};
