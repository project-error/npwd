import { IServerConfig } from '../../../common/typings/config';
import ServerConfig from '../../../config.autogen.json';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import Nui from '../../nui-events/utils/Nui';

interface IUsePhone {
  config?: IServerConfig;
  openPhone(): void;
  closePhone(): void;
}

export const usePhone = (): IUsePhone => {
  const { removeAlerts } = useNotifications();

  const closePhone = () => {
    removeAlerts();
    Nui.send('phone:close');
  };
  const openPhone = () => {
    Nui.send('phone:open');
  };

  return { config: ServerConfig as any, closePhone, openPhone };
};
