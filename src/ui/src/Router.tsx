import { createHashRouter, Link } from 'react-router-dom';
import { HomeView } from './views/Home';
import { ContactsView } from './Apps/Calls/Contacts';
import App from './App';
import { CallsApp } from './Apps/Calls';
import { ContactView } from './Apps/Calls/Contacts/Contact';
import { Call } from './Apps/Calls/Call';
import { KeypadView } from './Apps/Calls/Keypad';
import { LatestView } from './Apps/Calls/Latest';

export const router = createHashRouter([
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
        ],
      },
    ],
  },
  {
    path: 'about',
    element: <div>About</div>,
  },
  {
    path: '*',
    element: (
      <div className="p-8 text-primary h-full w-full bg-black text-slate-50 flex flex-col gap-8">
        <span>Not Found</span>
        <span>🤷</span>

        <Link to="/">
          <button className="border px-4 py-2 rounded-sm">
            <span>Go Home</span>
          </button>
        </Link>
      </div>
    ),
  },
]);
