import { useEffect } from 'react';
import { matchPath, useHistory } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { unreadNotifications } from './state';
import { useNotification } from './useNotification';

export const useNotificationBarListener = () => {
  const history = useHistory();
  const { markAsRead } = useNotification();

  const historyListener = useRecoilCallback(({ snapshot }) => async (location: any) => {
    const unreadNotis = await snapshot.getPromise(unreadNotifications);

    for (const unreadNoti of unreadNotis) {
      if (matchPath(location.pathname, { path: unreadNoti.path, exact: false })) {
        await markAsRead(unreadNoti.id);
      }
    }
  });

  useEffect(() => {
    const unlisten = history.listen(historyListener);

    return unlisten;
  }, [history, historyListener]);
};
