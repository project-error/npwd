import { useRecoilValue, useRecoilState } from 'recoil';

import { twitterState } from './state';

export const useTweetStatus = () => {
  const createTweetLoading = useRecoilValue(twitterState.createTweetLoading);
  const [createTweetSuccessful, setCreateTweetSuccessful] = useRecoilState(twitterState.createTweetSuccessful);
  return {
    createTweetLoading,
    createTweetSuccessful,
    setCreateTweetSuccessful,
  };
};
