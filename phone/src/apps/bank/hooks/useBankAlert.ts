import { useRecoilState } from 'recoil';
import { bankState } from './state';

export const useBankAlert = (): any => {
  const [bankAlert, setBankAlert] = useRecoilState(
    bankState.transferSuccessful
  );
  return { bankAlert, setBankAlert };
};
