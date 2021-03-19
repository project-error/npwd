import { useRecoilValue } from 'recoil';
import { ICall } from '../../../../../typings/call';
import { dialState } from './state';

export const useDialHistory = () => {
  return useRecoilValue<ICall[]>(dialState.history);
};
