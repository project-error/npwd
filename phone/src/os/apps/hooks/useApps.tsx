import React from 'react';
import { useConfig } from '../../../config/hooks/useConfig';
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
import { atom } from 'recoil';
import { CalculatorIcon } from '../../../apps/calculator/components/CalculatorIcon';
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

const appsState = atom({
  key: 'apps',
  default: {
    preinstalled: [
      {
        id: 'DIALER',
        nameLocale: 'APPS_DIALER',
        icon: <FontAwesomeIcon icon={faPhoneAlt} size='xs' />,
        backgroundColor: green[600],
        color: common.white,
        path: '/phone',
        Route: () => <Route path='/phone' component={DialerApp} />,
      },
      {
        id: 'MESSAGES',
        nameLocale: 'APPS_MESSAGES',
        icon: <MessageIcon fontSize='default' />,
        backgroundColor: amber[700],
        color: common.white,
        path: '/messages',
        Route: () => <Route path='/messages' component={MessagesApp} />,
      },
      {
        id: 'CONTACTS',
        nameLocale: 'APPS_CONTACTS',
        icon: <ContactsIcon />,
        backgroundColor: blue[500],
        color: common.white,
        path: '/contacts',
        Route: () => <Route path='/contacts' component={ContactsApp} />,
      },
      {
        id: 'CALCULATOR',
        nameLocale: 'APPS_CALCULATOR',
        icon: <CalculatorIcon />,
        backgroundColor: purple[500],
        color: grey[50],
        path: '/calculator',
        Route: () => <Route path='/calculator' component={CalculatorApp} />,
      },
      {
        id: 'SETTINGS',
        nameLocale: 'APPS_SETTINGS',
        icon: <SettingsIcon />,
        backgroundColor: '#383838',
        color: grey[50],
        path: '/settings',
        Route: () => <Route path='/settings' component={SettingsApp} />,
      },
      {
        id: 'BANK',
        nameLocale: 'APPS_BANK',
        icon: <FontAwesomeIcon icon={faWonSign} size='xs' />,
        backgroundColor: blue[900],
        color: common.white,
        path: '/bank',
        Route: () => <Route path='/bank' component={BankApp} />,
      },
      {
        id: 'TWITTER',
        nameLocale: 'APPS_TWITTER',
        icon: <FontAwesomeIcon icon={faTwitter} fixedWidth size='xs' />,
        backgroundColor: blue[600],
        color: common.white,
        path: '/twitter',
        Route: () => <Route path='/twitter' component={TwitterApp} />,
      },
      {
        id: 'SELLOUT',
        nameLocale: 'APPS_SELLOUT',
        icon: <FontAwesomeIcon icon={faAd} fixedWidth />,
        backgroundColor: red[500],
        color: common.white,
        path: '/sellout',
        Route: () => <Route path='/sellout' component={SelloutApp} />,
      },
      {
        id: 'NOTES',
        nameLocale: 'APPS_NOTES',
        icon: <FontAwesomeIcon icon={faStickyNote} fixedWidth />,
        backgroundColor: yellow[800],
        color: common.white,
        path: '/notes',
        Route: () => <Route path='/notes' component={NotesApp} />,
      },
      {
        id: 'EXAMPLE',
        nameLocale: 'APPS_EXAMPLE',
        icon: <FontAwesomeIcon icon={faPlaneArrival} size='sm' />,
        backgroundColor: blue[500],
        color: blue[50],
        path: '/example',
        Route: () => <Route path='/example' component={ExampleApp} />,
      },
    ],
  },
});

export const useApps = () => {
  const [apps, setApps] = useConfig(appsState);
  const allApps = [...apps.preinstalled];

  const getApp = (id) => allApps.find((a) => a.id === id) || null;

  return { apps, allApps, setApps, getApp };
};

export const useApp = (id) => {
  const { getApp } = useApps();
  return getApp(id);
};
