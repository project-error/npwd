import { useRecoilValue } from 'recoil';
import { ICall } from '../../../common/typings/call';
import { dialState } from './state';
interface ICallUI {
  history: ICall[]
}

export const useDialHistory = (): ICallUI => {
  const history = useRecoilValue(dialState.history);
  return history;
};
