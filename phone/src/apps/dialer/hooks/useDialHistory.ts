import { useRecoilValue } from 'recoil';
import { dialState } from './state';

export const useDialHistory = () => {
  return useRecoilValue(dialState.history);
};
