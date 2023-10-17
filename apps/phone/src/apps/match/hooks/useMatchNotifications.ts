import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useHistory } from 'react-router-dom';
import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';

const NOTIFICATION_ID = 'match:broadcast';

export const useMatchNotifications = () => {
  const [t] = useTranslation();
  const { push, listen } = useHistory();
  const { removeId, addNotification, addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MATCH');

  useEffect(() => {
    return listen((location) => {
      if (
        matchPath(location.pathname, {
          path: `/match/matches`,
          exact: true,
        })
      ) {
        removeId(NOTIFICATION_ID);
      }
    });
  }, [listen, removeId]);

  const setNotification = useCallback(
    ({ name }) => {
      const notification = {
        app: 'MATCH',
        id: NOTIFICATION_ID,
        sound: true,
        title: t('MATCH.FEEDBACK.NEW_LIKE_FOUND'),
        onClick: () => push(`/match/matches`),
        content: name,
        icon,
        notificationIcon,
      };

      addNotificationAlert(notification);
      addNotification(notification);
    },
    [addNotification, addNotificationAlert, icon, notificationIcon, push, t],
  );

  return { setNotification };
};
