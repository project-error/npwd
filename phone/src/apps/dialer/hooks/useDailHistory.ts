import { useRecoilValue } from 'recoil';
import { dailerState } from './state';

export const useDailHistory = () => {
  const history = useRecoilValue(dailerState.history);
  return history;
}