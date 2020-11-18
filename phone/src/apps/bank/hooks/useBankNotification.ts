import { useRecoilValue } from 'recoil';

import { Transfer } from '../../../common/interfaces/bank';
import { bankState } from './state';

interface IBankNotification {
  notification: Transfer | null;
}

export const useBankNotification = (): IBankNotification => {
  const notification = useRecoilValue<Transfer | null>(bankState.notification);
  return { notification }
}