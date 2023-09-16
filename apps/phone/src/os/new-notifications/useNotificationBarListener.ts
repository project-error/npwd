import { useEffect } from 'react';
import { Location, matchPath, useLocation } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { unreadNotifications } from './state';
import { useNotification } from './useNotification';

export const useNotificationBarListener = () => {
  const location = useLocation();

  const { markAsRead } = useNotification();

  const historyListener = useRecoilCallback(({ snapshot }) => async (location: Location) => {
    const unreadNotis = await snapshot.getPromise(unreadNotifications);

    for (const unreadNoti of unreadNotis) {
      if (
        matchPath(
          {
            path: unreadNoti.path,
          },
          location.pathname,
        )
      ) {
        await markAsRead(unreadNoti.id);
      }
    }
  });

  useEffect(() => {
    historyListener(location);
  }, [location, historyListener]);
};
