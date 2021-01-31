import { useRecoilValue } from 'recoil';
import { ICallUI } from '../../../common/typings/call';
import { dailerState } from './state';

interface ICall {
  history: ICallUI[]
}

export const useDailHistory = () => {
  const history = useRecoilValue(dailerState.history);
  return history;
};
