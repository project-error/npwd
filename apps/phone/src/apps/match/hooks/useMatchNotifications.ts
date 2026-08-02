import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation, useNavigate } from 'react-router';
import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';

const NOTIFICATION_ID = 'match:broadcast';

export const useMatchNotifications = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { removeId, addNotification, addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MATCH');

  useEffect(() => {
    if (matchPath({ path: '/match/matches', end: true }, location.pathname)) {
      removeId(NOTIFICATION_ID);
    }
  }, [location.pathname, removeId]);

  const setNotification = useCallback(
    ({ name }) => {
      const notification = {
        app: 'MATCH',
        id: NOTIFICATION_ID,
        sound: true,
        title: t('MATCH.FEEDBACK.NEW_LIKE_FOUND'),
        onClick: () => navigate('/match/matches'),
        content: name,
        icon,
        notificationIcon,
      };

      addNotificationAlert(notification);
      addNotification(notification);
    },
    [addNotification, addNotificationAlert, icon, navigate, notificationIcon, t],
  );

  return { setNotification };
};
