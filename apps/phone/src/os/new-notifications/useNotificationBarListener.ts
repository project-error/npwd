import { useCallback, useEffect } from 'react';
import { matchPath, useLocation } from 'react-router';
import { useUnreadNotifications } from './state';
import { useNotification } from './useNotification';

export const useNotificationBarListener = () => {
  const location = useLocation();
  const { markAsRead } = useNotification();
  const unreadNotis = useUnreadNotifications();

  const locationListener = useCallback(
    async (pathname: string) => {
      for (const unreadNoti of unreadNotis) {
        if (matchPath({ path: unreadNoti.path, end: false }, pathname)) {
          await markAsRead(unreadNoti.id);
        }
      }
    },
    [markAsRead, unreadNotis],
  );

  useEffect(() => {
    locationListener(location.pathname);
  }, [location.pathname, locationListener]);
};
