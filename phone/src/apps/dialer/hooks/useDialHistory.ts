import { useRecoilValue } from 'recoil';
import { ICall } from '../../../common/typings/call';
import { dailerState } from './state';
interface ICallUI {
  history: ICall[]
}

export const useDailHistory = (): ICallUI => {
  const history = useRecoilValue(dailerState.history);
  return history;
};
