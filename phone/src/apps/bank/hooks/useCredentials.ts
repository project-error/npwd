import { useRecoilValue } from 'recoil';
import { bankState } from './state';
import { IBankCredentials } from '../../../../../typings/bank';

interface ICredentialsHook {
  credentials: IBankCredentials;
}

export const useCredentials = (): ICredentialsHook => {
  const credentials = useRecoilValue(bankState.bankCredentials);
  return { credentials };
};
