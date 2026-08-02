import { useAtomValue } from 'jotai';
import { ResourceConfig } from '@typings/config';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { phoneState } from './state';
import { PhoneEvents } from '@typings/phone';
import fetchNui from '@utils/fetchNui';

interface IUsePhone {
  ResourceConfig?: ResourceConfig;
  openPhone(): void;
  closePhone(): void;
  isPhoneOpen: boolean;
}

export const usePhone = (): IUsePhone => {
  const isPhoneOpen = useAtomValue(phoneState.visibility);
  const config = useAtomValue(phoneState.resourceConfig);

  const { removeAlerts } = useNotifications();

  const closePhone = () => {
    removeAlerts();
    fetchNui(PhoneEvents.CLOSE_PHONE, undefined, {}).catch();
  };

  const openPhone = () => {
    fetchNui(PhoneEvents.OPEN_PHONE, undefined, {}).catch();
  };

  return {
    ResourceConfig: config,
    closePhone,
    openPhone,
    isPhoneOpen,
  };
};
