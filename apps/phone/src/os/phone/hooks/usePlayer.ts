import { useRecoilValue } from 'recoil';
import { phoneState } from './state';

export const usePlayer = () => {
  return useRecoilValue(phoneState.playerSource);
};
