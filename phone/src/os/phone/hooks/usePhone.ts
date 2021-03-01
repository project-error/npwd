import { useRecoilValue } from 'recoil';
import { IServerConfig } from '../../../common/typings/config';
import ServerConfig from '../../../config.autogen.json';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import Nui from '../../nui-events/utils/Nui';
import { phoneState } from './state';

interface IUsePhone {
  config?: IServerConfig;
  openPhone(): void;
  closePhone(): void;
  isPhoneOpen: boolean;
}

export const usePhone = (): IUsePhone => {
  const isPhoneOpen = useRecoilValue(phoneState.visibility);
  
  const { removeAlerts } = useNotifications();

  const closePhone = () => {
    removeAlerts();
    Nui.send('phone:close');
  };
  const openPhone = () => {
    Nui.send('phone:open');
  };

  return { config: ServerConfig as any, closePhone, openPhone, isPhoneOpen };
};
