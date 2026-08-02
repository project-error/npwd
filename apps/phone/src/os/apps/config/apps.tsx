import React from 'react';
import { DialerApp } from '@apps/dialer/components/dialer-app';
import { ContactsApp } from '@apps/contacts/components/contacts-app';
import { CalculatorApp } from '@apps/calculator/components/CalculatorApp';
import { SettingsApp } from '@apps/settings/components/SettingsApp';
import { MessagesApp } from '@apps/messages/components/messages-app';
import { ExampleAppWrapper } from '@apps/example/components/ExampleAppWrapper';
import { MarketplaceApp } from '@apps/marketplace/components/marketplace-app';
import { NotesApp } from '@apps/notes/notes-app';
import CameraApp from '@apps/camera/components/camera-app';

import {
  MESSAGES_APP_PRIMARY_COLOR,
  MESSAGES_APP_TEXT_COLOR,
} from '@apps/messages/messages.theme';
import {
  CONTACTS_APP_PRIMARY_COLOR,
  CONTACTS_APP_TEXT_COLOR,
} from '@apps/contacts/contacts.theme';
import {
  MARKETPLACE_APP_PRIMARY_COLOR,
  MARKETPLACE_APP_ICON_COLOR,
} from '@apps/marketplace/marketplace.theme';
import { NOTES_APP_ICON_COLOR, NOTES_APP_PRIMARY_COLOR } from '@apps/notes/notes.theme';
import { DIALER_APP_PRIMARY_COLOR, DIALER_APP_TEXT_COLOR } from '@apps/dialer/dialer.theme';
import {
  TWITTER_APP_PRIMARY_COLOR,
  TWITTER_APP_TEXT_COLOR,
} from '@apps/twitter/twitter.theme';
import { MATCH_APP_PRIMARY_COLOR, MATCH_APP_TEXT_COLOR } from '@apps/match/match.theme';
import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import { BrowserApp } from '@apps/browser/components/BrowserApp';
import { MatchApp } from '@apps/match/components/match-app';
import LifeInvaderContainer from '@apps/twitter/components/twitter-container';
import {
  DARKCHAT_APP_PRIMARY_COLOR,
  DARKCHAT_APP_TEXT_COLOR,
} from '@apps/darkchat/darkchat.theme';
import DarkChatApp from '../../../apps/darkchat/dark-chat-app';
import DialerAppIcon from '../icons/material/app/DIALER';
import BrowserIcon from '../icons/material/app/BROWSER';
import MessagesIcon from '../icons/material/app/MESSAGES';
import DarkchatIcon from '../icons/material/app/DARKCHAT';
import ContactIcon from '../icons/material/app/CONTACTS';
import Calculator from '../icons/material/app/CALCULATOR';
import SettingsIcon from '../icons/material/app/SETTINGS';
import MatchIcon from '../icons/material/app/MATCH';
import TwitterIcon from '../icons/material/app/TWITTER';
import MarketplaceIcon from '../icons/material/app/MARKETPLACE';
import NotesIcon from '../icons/material/app/NOTES';
import Camera from '../icons/material/app/CAMERA';
import ExampleIcon from '../icons/material/app/EXAMPLE';

export type IconComponentProps = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

export interface IAppConfig {
  id: string;
  nameLocale: string;
  backgroundColor: string;
  color: string;
  path: string;
  disable?: boolean;
  Component: React.ComponentType<any>;
  emitOnOpen?: boolean;
  icon: JSX.Element;
}

export type IApp = IAppConfig & {
  notification: INotificationIcon;
  icon: JSX.Element;
  isDisabled: boolean;
  notificationIcon: JSX.Element;
  NotificationIcon: IconComponentProps;
  Icon?: IconComponentProps;
  theme?: any;
};

export const APPS: IAppConfig[] = [
  {
    id: 'DIALER',
    nameLocale: 'APPS_DIALER',
    backgroundColor: DIALER_APP_PRIMARY_COLOR,
    icon: <DialerAppIcon />,
    color: DIALER_APP_TEXT_COLOR,
    path: '/phone',
    Component: DialerApp,
    emitOnOpen: false,
  },
  {
    id: 'BROWSER',
    nameLocale: 'BROWSER.NAME',
    backgroundColor: '#64b5f6',
    path: '/browser',
    icon: <BrowserIcon />,
    color: '#ffffff',
    Component: BrowserApp,
    emitOnOpen: false,
  },
  {
    id: 'MESSAGES',
    nameLocale: 'APPS_MESSAGES',
    icon: <MessagesIcon />,
    backgroundColor: MESSAGES_APP_PRIMARY_COLOR,
    color: MESSAGES_APP_TEXT_COLOR,
    path: '/messages',
    Component: MessagesApp,
    emitOnOpen: false,
  },
  {
    id: 'DARKCHAT',
    nameLocale: 'APPS_DARKCHAT',
    icon: <DarkchatIcon />,
    backgroundColor: DARKCHAT_APP_PRIMARY_COLOR,
    color: DARKCHAT_APP_TEXT_COLOR,
    path: '/darkchat',
    Component: DarkChatApp,
    emitOnOpen: false,
  },
  {
    id: 'CONTACTS',
    nameLocale: 'APPS_CONTACTS',
    backgroundColor: CONTACTS_APP_PRIMARY_COLOR,
    icon: <ContactIcon />,
    color: CONTACTS_APP_TEXT_COLOR,
    path: '/contacts',
    Component: ContactsApp,
    emitOnOpen: false,
  },
  {
    id: 'CALCULATOR',
    nameLocale: 'APPS_CALCULATOR',
    icon: <Calculator />,
    backgroundColor: '#9c27b0',
    color: '#fafafa',
    path: '/calculator',
    Component: CalculatorApp,
    emitOnOpen: false,
  },
  {
    id: 'SETTINGS',
    nameLocale: 'APPS_SETTINGS',
    icon: <SettingsIcon />,
    backgroundColor: '#383838',
    color: '#fafafa',
    path: '/settings',
    Component: SettingsApp,
    emitOnOpen: false,
  },
  {
    id: 'MATCH',
    nameLocale: 'APPS_MATCH',
    icon: <MatchIcon />,
    backgroundColor: MATCH_APP_PRIMARY_COLOR,
    color: MATCH_APP_TEXT_COLOR,
    path: '/match',
    Component: MatchApp,
    emitOnOpen: false,
  },
  {
    id: 'TWITTER',
    nameLocale: 'APPS_TWITTER',
    icon: <TwitterIcon />,
    backgroundColor: TWITTER_APP_PRIMARY_COLOR,
    color: TWITTER_APP_TEXT_COLOR,
    path: '/twitter',
    Component: LifeInvaderContainer,
    emitOnOpen: false,
  },
  {
    id: 'MARKETPLACE',
    nameLocale: 'APPS_MARKETPLACE',
    icon: <MarketplaceIcon />,
    backgroundColor: MARKETPLACE_APP_PRIMARY_COLOR,
    color: MARKETPLACE_APP_ICON_COLOR,
    path: '/marketplace',
    Component: MarketplaceApp,
    emitOnOpen: false,
  },
  {
    id: 'NOTES',
    nameLocale: 'APPS_NOTES',
    icon: <NotesIcon />,
    backgroundColor: NOTES_APP_PRIMARY_COLOR,
    color: NOTES_APP_ICON_COLOR,
    path: '/notes',
    Component: NotesApp,
    emitOnOpen: false,
  },
  {
    id: 'CAMERA',
    nameLocale: 'APPS_CAMERA',
    icon: <Camera />,
    backgroundColor: '#bdbdbd',
    color: '#ffffff',
    path: '/camera',
    Component: CameraApp,
    emitOnOpen: false,
  },
];

// Example app only in dev
if (import.meta.env.DEV) {
  APPS.push({
    id: 'EXAMPLE',
    nameLocale: 'APPS_EXAMPLE',
    icon: <ExampleIcon />,
    backgroundColor: '#2196f3',
    color: '#e3f2fd',
    path: '/example',
    Component: ExampleAppWrapper,
    emitOnOpen: false,
  });
}
