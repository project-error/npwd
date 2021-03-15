import { useRecoilValue } from 'recoil';

import { Transfer } from '../../../../../typings/bank';
import { bankState } from './state';

export const useBankNotification = () => {
  return useRecoilValue<Transfer | null>(bankState.notification);
};
