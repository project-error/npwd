import { useRecoilValue } from 'recoil';
import { bankState } from './state'; 

export const useCredentials = (): any => {
  const credentials = useRecoilValue(bankState.bankCredentials);
  return { credentials };
}