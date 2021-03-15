import { useRecoilValue } from 'recoil';
import { bankState } from './state';
import { IBankCredentials } from '../../../../../typings/bank';

export const useCredentials = () => {
  return useRecoilValue<IBankCredentials>(bankState.bankCredentials);
};
