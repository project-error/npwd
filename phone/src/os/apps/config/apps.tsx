import React from 'react';
import { blue, common, grey, purple } from '@material-ui/core/colors';
import { DialerApp } from '../../../apps/dialer/components/DialerApp';
import { ContactsApp } from '../../../apps/contacts/components/ContactsApp';
import { CalculatorApp } from '../../../apps/calculator/components/CalculatorApp';
import { SettingsApp } from '../../../apps/settings/components/SettingsApp';
import { MessagesApp } from '../../../apps/messages/components/MessagesApp';
import { MatchApp } from '../../../apps/match/components/MatchApp';
import { TwitterApp } from '../../../apps/twitter/components/TwitterApp';
import { ExampleApp } from '../../../apps/example/components/ExampleApp';
import { MarketplaceApp } from '../../../apps/marketplace/components/MarketplaceApp';
import { NotesApp } from '../../../apps/notes/NotesApp';
import CameraApp from '../../../apps/camera/components/CameraApp';
import { AppRoute } from '../components/AppRoute';

import {
  MESSAGES_APP_PRIMARY_COLOR,
  MESSAGES_APP_TEXT_COLOR,
} from '../../../apps/messages/messages.theme';
import {
  CONTACTS_APP_PRIMARY_COLOR,
  CONTACTS_APP_TEXT_COLOR,
} from '../../../apps/contacts/contacts.theme';
import {
  SELLOUT_APP_PRIMARY_COLOR,
  SELLOUT_APP_ICON_COLOR,
} from '../../../apps/marketplace/marketplace.theme';
import { NOTES_APP_ICON_COLOR, NOTES_APP_PRIMARY_COLOR } from '../../../apps/notes/notes.theme';
import { DIALER_APP_PRIMARY_COLOR, DIALER_APP_TEXT_COLOR } from '../../../apps/dialer/dialer.theme';
import {
  TWITTER_APP_PRIMARY_COLOR,
  TWITTER_APP_TEXT_COLOR,
} from '../../../apps/twitter/twitter.theme';
import { MATCH_APP_PRIMARY_COLOR, MATCH_APP_TEXT_COLOR } from '../../../apps/match/match.theme';
import { SvgIconProps } from '@material-ui/core';
import { INotificationIcon } from '../../notifications/providers/NotificationsProvider';

export interface IAppConfig {
  id: string;
  nameLocale: string;
  backgroundColor: string;
  color: string;
  path: string;
  Route: React.FC;
}

export type IApp = IAppConfig & {
  notification: INotificationIcon;
  icon: JSX.Element;
  notificationIcon: JSX.Element;
  NotificationIcon: React.FC<SvgIconProps>;
  Icon: React.FC<SvgIconProps>;
};

export const APPS: IAppConfig[] = [
  {
    id: 'DIALER',
    nameLocale: 'APPS_DIALER',
    backgroundColor: DIALER_APP_PRIMARY_COLOR,
    color: DIALER_APP_TEXT_COLOR,
    path: '/phone',
    Route: () => <AppRoute id="DIALER" path="/phone" component={DialerApp} />,
  },
  {
    id: 'MESSAGES',
    nameLocale: 'APPS_MESSAGES',
    backgroundColor: MESSAGES_APP_PRIMARY_COLOR,
    color: MESSAGES_APP_TEXT_COLOR,
    path: '/messages',
    Route: () => <AppRoute id="MESSAGES" path="/messages" component={MessagesApp} />,
  },
  {
    id: 'CONTACTS',
    nameLocale: 'APPS_CONTACTS',
    backgroundColor: CONTACTS_APP_PRIMARY_COLOR,
    color: CONTACTS_APP_TEXT_COLOR,
    path: '/contacts',
    Route: () => <AppRoute id="CONTACTS" path="/contacts" component={ContactsApp} />,
  },
  {
    id: 'CALCULATOR',
    nameLocale: 'APPS_CALCULATOR',
    backgroundColor: purple[500],
    color: grey[50],
    path: '/calculator',
    Route: () => <AppRoute id="CALCULATOR" path="/calculator" component={CalculatorApp} />,
  },
  {
    id: 'SETTINGS',
    nameLocale: 'APPS_SETTINGS',
    backgroundColor: '#383838',
    color: grey[50],
    path: '/settings',
    Route: () => <AppRoute id="SETTINGS" path="/settings" component={SettingsApp} />,
  },
  /* Hiding the bank app while the bank resource gets done */
  /*{
    id: 'BANK',
    nameLocale: 'APPS_BANK',
    backgroundColor: blue[900],
    color: common.white,
    path: '/bank',
    Route: () => <AppRoute id="BANK" path="/bank" component={BankApp} />,
  },*/
  {
    id: 'MATCH',
    nameLocale: 'APPS_MATCH',
    backgroundColor: MATCH_APP_PRIMARY_COLOR,
    color: MATCH_APP_TEXT_COLOR,
    path: '/match',
    Route: () => <AppRoute id="MATCH" path="/match" component={MatchApp} />,
  },
  {
    id: 'TWITTER',
    nameLocale: 'APPS_TWITTER',
    backgroundColor: TWITTER_APP_PRIMARY_COLOR,
    color: TWITTER_APP_TEXT_COLOR,
    path: '/twitter',
    Route: () => <AppRoute id="TWITTER" path="/twitter" component={TwitterApp} />,
  },
  {
    id: 'SELLOUT',
    nameLocale: 'APPS_SELLOUT',
    backgroundColor: SELLOUT_APP_PRIMARY_COLOR,
    color: SELLOUT_APP_ICON_COLOR,
    path: '/marketplace',
    Route: () => <AppRoute id="MARKETPLACE" path="/marketplace" component={MarketplaceApp} />,
  },
  {
    id: 'NOTES',
    nameLocale: 'APPS_NOTES',
    backgroundColor: NOTES_APP_PRIMARY_COLOR,
    color: NOTES_APP_ICON_COLOR,
    path: '/notes',
    Route: () => <AppRoute id="NOTES" path="/notes" component={NotesApp} />,
  },
  {
    id: 'CAMERA',
    nameLocale: 'APPS_CAMERA',
    backgroundColor: grey['A400'],
    color: common.white,
    path: '/camera',
    Route: () => <AppRoute id="CAMERA" path="/camera" component={CameraApp} />,
  },
];

// Example app only in dev
if (process.env.NODE_ENV === 'development') {
  APPS.push({
    id: 'EXAMPLE',
    nameLocale: 'APPS_EXAMPLE',
    backgroundColor: blue[500],
    color: blue[50],
    path: '/example',
    Route: () => <AppRoute id="EXAMPLE" path="/example" component={ExampleApp} />,
  });
}
