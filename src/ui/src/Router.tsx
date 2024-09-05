import { createHashRouter, Link } from 'react-router-dom';
import { HomeView } from './views/Home';
import { ContactsApp } from './apps/contacts';
import App from './App';

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
            path: 'contacts',
            element: <ContactsApp />,
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
