import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';
import { useLatestPath } from '../../hooks/useLatestPath';

export const CallsApp = () => {
  useEffect(() => {
    document.title = 'Calls';
  }, []);

  /**
   * Save the last visited path under /apps/calls to localStorage, so we can
   * redirect the user to the last visited path when they return to the app.
   *
   * This is a common pattern in mobile apps, where the user is redirected to
   * the last visited screen when they return to the app.
   */
  useLatestPath('/apps/calls');

  return (
    <div className="flex flex-col gap-2 flex-1 h-full overflow-hidden">
      <section className="flex-1 overflow-auto">
        <Outlet />
      </section>

      <div className="flex gap-2 justify-between mt-auto border-t p-4">
        <Link to="/apps/calls/latest" className="p-4 bg-secondary rounded-lg">
          Latest
        </Link>
        <Link to="/apps/calls/contacts" className="p-4 bg-secondary rounded-lg">
          Contacts
        </Link>
        <Link to="/apps/calls/keypad" className="p-4 bg-secondary rounded-lg">
          Keypad
        </Link>
      </div>
    </div>
  );
};
