import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useActiveCall } from '../../api/hooks/useActiveCall';
import { setCallChannel } from '../../api/calls';
import { useLatestPath } from '../../hooks/useLatestPath';

export const CallsApp = () => {
  const navigate = useNavigate();
  const [call] = useActiveCall();

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
  useLatestPath('/apps/calls', ['/apps/calls/call']);

  useEffect(() => {
    if (call) {
      if (call.accepted_at) {
        setCallChannel(call.id);
      }
      navigate('/apps/calls/call');
    } else {
      setCallChannel(0);
    }
  }, [call]);

  return (
    <div className="flex flex-col gap-2 flex-1 h-full overflow-hidden">
      <section className="flex-1 overflow-auto">
        <Outlet />
      </section>

      <div className="flex gap-2 justify-between mt-auto border-t p-4 mb-4">
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
