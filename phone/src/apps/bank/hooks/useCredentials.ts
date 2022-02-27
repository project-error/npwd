import { useRecoilValue } from 'recoil';
import { bankState } from './state';

export const useCredentials = () => {
  return useRecoilValue(bankState.bankCredentials);
};
