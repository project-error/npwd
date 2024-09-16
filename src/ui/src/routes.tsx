import { createHashRouter, Link } from 'react-router-dom';
import { HomeView } from './views/Home';
import { ContactsView } from './Apps/Calls/Contacts';
import App from './App';
import { CallsApp } from './Apps/Calls';
import { ContactView } from './Apps/Calls/Contacts/Contact';
import { Call } from './Apps/Calls/Call';
import { KeypadView } from './Apps/Calls/Keypad';
import { LatestView } from './Apps/Calls/Latest';
import { CasinoApp } from './Apps/Casino';
import { SettingsApp } from './Apps/Settings/SettingsApp';
import { MessagesApp } from './Apps/Calls/Messages';
import { Conversation } from './Apps/Calls/Messages/Conversation';
import { NewContactView } from './Apps/Calls/Contacts/New';
import { NotFound } from './views/NotFound';

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'home',
        element: <HomeView />,
      },
      {
        path: 'apps',
        children: [
          {
            path: 'calls',
            element: <CallsApp />,
            children: [
              {
                path: 'call',
                element: <Call />,
              },
              {
                path: 'call/:phoneNumber',
                element: <Call />,
              },
              {
                path: 'keypad',
                element: <KeypadView />,
              },
              {
                path: 'contacts',
                element: <ContactsView />,
                children: [
                  {
                    path: 'new',
                    element: <NewContactView />,
                  },
                ],
              },
              {
                path: 'contacts/:contactId',
                element: <ContactView />,
              },
              {
                path: 'latest',
                element: <LatestView />,
              },
            ],
          },
          {
            path: 'casino',
            element: <CasinoApp />,
          },
          {
            path: 'messages',
            element: <MessagesApp />,
          },
          {
            path: 'conversation',
            element: <Conversation />,
          },
          {
            path: 'conversation/:phoneNumber',
            element: <Conversation />,
          },
          {
            path: 'settings',
            element: <SettingsApp />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <App />,
    children: [
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
