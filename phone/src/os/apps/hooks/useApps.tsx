import React, {useCallback, useEffect, useMemo} from 'react';
import {
  blue,
  common,
  grey,
  green,
  purple,
  yellow,
  red,
  amber,
} from '@material-ui/core/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAd,
  faPlaneArrival,
  faPhoneAlt,
  faWonSign,
  faStickyNote,
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

import ContactsIcon from '@material-ui/icons/Contacts';
import SettingsIcon from '@material-ui/icons/Settings';
import MessageIcon from '@material-ui/icons/Message';
import { atom, useRecoilState } from 'recoil';
import { CalculatorIcon } from '../../../apps/calculator/components/CalculatorIcon';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { Route } from 'react-router-dom';
import { DialerApp } from '../../../apps/dialer/components/DialerApp';
import { ContactsApp } from '../../../apps/contacts/components/ContactsApp';
import { CalculatorApp } from '../../../apps/calculator/components/CalculatorApp';
import { SettingsApp } from '../../../apps/settings/components/SettingsApp';
import { BankApp } from '../../../apps/bank/components/BankApp';
import { MessagesApp } from '../../../apps/messages/components/MessagesApp';
import { TwitterApp } from '../../../apps/twitter/components/TwitterApp';
import { ExampleApp } from '../../../apps/example/components/ExampleApp';
import { SelloutApp } from '../../../apps/sellout/components/SelloutApp';
import { NotesApp } from '../../../apps/notes/NotesApp';
import CameraApp from '../../../apps/camera/components/CameraApp';
import Nui from "../../nui-events/utils/Nui";

export interface IAppConfig {
  id: string;
  nameLocale: string;
  icon: JSX.Element;
  notificationIcon: JSX.Element;
  backgroundColor: string;
  color: string;
  path: string;
  Route: React.FC;
}

type AppsRepository = { preinstalled: IAppConfig[] };

const AppWithStartup = ({ children, id }) => {
  useEffect(() => {
    Nui.send(`phone:app:${id}`);
  }, []);
  return children;
};

const AppRoute = ({ id, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => <AppWithStartup id={id}><Component /></AppWithStartup>}
    />
  );
};

const appsState = atom<AppsRepository>({
  key: 'apps',
  default: {
    preinstalled: [
      {
        id: 'DIALER',
        nameLocale: 'APPS_DIALER',
        icon: <FontAwesomeIcon icon={faPhoneAlt} size='xs' />,
        notificationIcon: <FontAwesomeIcon icon={faPhoneAlt} size='xs' />,
        backgroundColor: green[600],
        color: common.white,
        path: '/phone',
        Route: () => <AppRoute id="DIALER" path='/phone' component={DialerApp} />,
      },
      {
        id: 'MESSAGES',
        nameLocale: 'APPS_MESSAGES',
        icon: <MessageIcon fontSize='default' />,
        notificationIcon: <MessageIcon fontSize='small' />,
        backgroundColor: amber[700],
        color: common.white,
        path: '/messages',
        Route: () => <AppRoute id="MESSAGE" path='/messages' component={MessagesApp} />,
      },
      {
        id: 'CONTACTS',
        nameLocale: 'APPS_CONTACTS',
        icon: <ContactsIcon />,
        notificationIcon: <ContactsIcon fontSize="small" />,
        backgroundColor: blue[500],
        color: common.white,
        path: '/contacts',
        Route: () => <AppRoute id="CONTACTS" path='/contacts' component={ContactsApp} />,
      },
      {
        id: 'CALCULATOR',
        nameLocale: 'APPS_CALCULATOR',
        icon: <CalculatorIcon />,
        notificationIcon: <CalculatorIcon fontSize="small"/>,
        backgroundColor: purple[500],
        color: grey[50],
        path: '/calculator',
        Route: () => <AppRoute id="CALCULATOR" path='/calculator' component={CalculatorApp} />,
      },
      {
        id: 'SETTINGS',
        nameLocale: 'APPS_SETTINGS',
        icon: <SettingsIcon />,
        notificationIcon: <SettingsIcon fontSize="small"/>,
        backgroundColor: '#383838',
        color: grey[50],
        path: '/settings',
        Route: () => <AppRoute id="SETTINGS" path='/settings' component={SettingsApp} />,
      },
      {
        id: 'BANK',
        nameLocale: 'APPS_BANK',
        icon: <FontAwesomeIcon icon={faWonSign} size='xs' />,
        notificationIcon: <FontAwesomeIcon icon={faWonSign} size='xs' />,
        backgroundColor: blue[900],
        color: common.white,
        path: '/bank',
        Route: () => <AppRoute id="BANK" path='/bank' component={BankApp} />,
      },
      {
        id: 'TWITTER',
        nameLocale: 'APPS_TWITTER',
        icon: <FontAwesomeIcon icon={faTwitter} fixedWidth size='xs' />,
        notificationIcon: <FontAwesomeIcon icon={faTwitter} fixedWidth size='xs' />,
        backgroundColor: blue[600],
        color: common.white,
        path: '/twitter',
        Route: () => <AppRoute id="TWITTER" path='/twitter' component={TwitterApp} />,
      },
      {
        id: 'SELLOUT',
        nameLocale: 'APPS_SELLOUT',
        icon: <FontAwesomeIcon icon={faAd} fixedWidth />,
        notificationIcon: <FontAwesomeIcon icon={faAd} fixedWidth size="xs" />,
        backgroundColor: red[500],
        color: common.white,
        path: '/sellout',
        Route: () => <AppRoute id="SELLOUT" path='/sellout' component={SelloutApp} />,
      },
      {
        id: 'NOTES',
        nameLocale: 'APPS_NOTES',
        icon: <FontAwesomeIcon icon={faStickyNote} fixedWidth />,
        notificationIcon: <FontAwesomeIcon icon={faStickyNote} fixedWidth size="xs" />,
        backgroundColor: yellow[800],
        color: common.white,
        path: '/notes',
        Route: () => <AppRoute id="NOTES" path='/notes' component={NotesApp} />,
      },
      {
        id: 'CAMERA',
        nameLocale: 'APPS_CAMERA',
        icon: <CameraAltIcon fontSize='large' />,
        notificationIcon: <CameraAltIcon fontSize='small' />,
        backgroundColor: grey['A400'],
        color: common.white,
        path: '/camera',
        Route: () => <AppRoute id="CAMERA" path='/camera' component={CameraApp} />,
      },
      {
        id: 'EXAMPLE',
        nameLocale: 'APPS_EXAMPLE',
        icon: <FontAwesomeIcon icon={faPlaneArrival} size='sm' />,
        notificationIcon: <FontAwesomeIcon icon={faPlaneArrival} size='xs' />,
        backgroundColor: blue[500],
        color: blue[50],
        path: '/example',
        Route: () => <AppRoute id="EXAMPLE" path='/example' component={ExampleApp}/>,
      },
    ],
  },
});

export const useApps = () => {
  const [apps, setApps] = useRecoilState<AppsRepository>(appsState);
  const allApps = useMemo(() => [...apps.preinstalled], [apps.preinstalled]);
  const getApp = useCallback((id: string): IAppConfig => allApps.find((a) => a.id === id) || null, [allApps]);
  return { apps, allApps, setApps, getApp };
};

export const useApp = (id: string): IAppConfig => {
  const { getApp } = useApps();
  return getApp(id);
};
