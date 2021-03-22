import { useRecoilValue } from 'recoil';
import { IServerConfig } from '../../../../../typings/config';
import ServerConfig from '../../../config.autogen.json';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import Nui from '../../nui-events/utils/Nui';
import { phoneState } from './state';
import { PhoneEvents } from '../../../../../typings/phone';

interface IUsePhone {
  config?: IServerConfig;
  openPhone(): void;
  closePhone(): void;
  isPhoneOpen: boolean;
  isPhoneReady: boolean;
}

export const usePhone = (): IUsePhone => {
  const isPhoneOpen = useRecoilValue(phoneState.visibility);
  const isPhoneReady = useRecoilValue(phoneState.phoneReady);

  const { removeAlerts } = useNotifications();

  const closePhone = () => {
    removeAlerts();
    Nui.send(PhoneEvents.CLOSE_PHONE);
  };
  const openPhone = () => {
    Nui.send(PhoneEvents.OPEN_PHONE);
  };

  return { config: ServerConfig as any, closePhone, openPhone, isPhoneOpen, isPhoneReady };
};
