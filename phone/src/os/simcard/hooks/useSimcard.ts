import { useRecoilValue } from 'recoil';
import { simcardState } from './state';

export const useSimcard = () => {
  const number = useRecoilValue(simcardState.number);
  return { number };
};
