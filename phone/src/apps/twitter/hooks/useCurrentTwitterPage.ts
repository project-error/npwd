import { useRecoilState } from 'recoil';
import { twitterState } from './state';

export const useCurrentTwitterPage = () => {
  const [currId, setCurr] = useRecoilState(twitterState.tweetPageId);
  const increase = (val = 1) => {
    setCurr(currId + val);
  };
  const decrease = (val = 1) => {
    setCurr(currId - val);
  };
  const set = (val = 0) => {
    setCurr(val);
  };

  return { increase, decrease, set, pageId: currId };
};
