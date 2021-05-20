import { useRecoilValue } from 'recoil';
import { ResourceConfig } from '../../../../../typings/config';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { phoneState } from './state';
import { PhoneEvents } from '../../../../../typings/phone';

interface IUsePhone {
  ResourceConfig?: ResourceConfig;
  openPhone(): void;
  closePhone(): void;
  isPhoneOpen: boolean;
  //isPhoneReady: boolean;
}

export const usePhone = (): IUsePhone => {
  const Nui = useNuiRequest();
  const isPhoneOpen = useRecoilValue(phoneState.visibility);
  //const isPhoneReady = useRecoilValue(phoneState.phoneReady);
  const config = useRecoilValue(phoneState.resourceConfig);

  const { removeAlerts } = useNotifications();

  const closePhone = () => {
    removeAlerts();
    Nui.send(PhoneEvents.CLOSE_PHONE);
  };
  const openPhone = () => {
    Nui.send(PhoneEvents.OPEN_PHONE);
  };

  return {
    ResourceConfig: config as ResourceConfig,
    closePhone,
    openPhone,
    isPhoneOpen,
    //isPhoneReady,
  };
};
