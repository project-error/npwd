import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { bankState } from './state';
import { useTransactions } from './useTransactions';
import { useCredentials } from './useCredentials';
import { useSetRecoilState } from 'recoil';
import { useBankNotification } from './useBankNotification';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { BankEvents } from '../../../../../typings/bank';
import { PhoneEvents } from '../../../../../typings/phone';

export const useBankService = () => {
  const setTransaction = useSetRecoilState(bankState.transactions);
  const setCredentials = useSetRecoilState(bankState.bankCredentials);
  const setNotification = useSetRecoilState(bankState.notification);
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent('BANK', BankEvents.SEND_TRANSFERS, setTransaction);
  useNuiEvent('BANK', BankEvents.SEND_CREDENTIALS, setCredentials);
  useNuiEvent('BANK', BankEvents.SEND_ALERT, handleAddAlert);
  useNuiEvent('BANK', BankEvents.SEND_NOTIFICATION, setNotification);
  return { useTransactions, useCredentials, useBankNotification };
};
