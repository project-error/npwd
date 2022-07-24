import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { useNuiCallback, useNuiEvent } from 'fivem-nui-react-lib';
import { INotification } from '@os/notifications/providers/NotificationsProvider';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WaterIcon from '@mui/icons-material/Water';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CellTowerIcon from '@mui/icons-material/CellTower';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import { IUniversalNotification } from '../../resources/client/cl_banking';
import { Warning } from '@mui/icons-material';
const icons = {
  ['bank']: <AccountBalanceIcon />,
  ['invoice']: <RequestQuoteIcon />,
  ['warning']: <WarningAmberIcon />,
  ['water']: <WaterIcon />,
  ['medic']: <MedicalServicesIcon />,
  ['broadcast']: <CellTowerIcon />,
  ['support']: <SupportAgentIcon />,
};
// interface IUniversalNotification {
//   app: string;
//   id?: string;
//   title: string;
//   content?: string;
//   icon?: string;
//   notificationIcon?: string;
//   sound?: boolean;
//   cantClose?: boolean;
//   keepWhenPhoneClosed?: boolean;
//   backgroundColor?: string;
//   color?: string;
// }

export const GlobalNotifier = function () {
  const { addNotificationAlert } = useNotifications();

  useNuiEvent('GLOBALNOTIFICATION', 'sendNotification', (data: IUniversalNotification) => {
    console.log('showing notification', JSON.stringify(data));
    //title, content, sound
    const notification = {
      app: data.app ?? 'GLOBALNOTIFICATION',
      backgroundColor: '',
      cantClose: data.cantClose ?? false,
      color: '',
      content: data.content,
      icon: icons[data.icon] ? icons[data.icon] : '',
      id: 'global:notification',
      notificationIcon: icons[data.icon] ? icons[data.icon] : '',
      sound: data.sound ?? false,
      title: data.title,
    };
    console.log('parsed notif:', JSON.stringify(notification));
    addNotificationAlert(notification);
  });
  return <div></div>;
};
