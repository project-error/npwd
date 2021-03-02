import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useNotifications } from '../../../os/notifications/hooks/useNotifications';
import { twitterState } from './state';

export const useTwitterNotifications = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { addNotificationAlert } = useNotifications();

  const { icon, notificationIcon } = useApp('TWITTER');

  const [unreadCount, setUnreadCount] = useRecoilState(twitterState.unreadTweetsCount);

  const setNotification = useCallback(
    ({ profile_name, message }) => {
      setUnreadCount((curr) => {
        const unread = curr + 1;
        addNotificationAlert(
          {
            app: 'TWITTER',
            sound: true,
            title: t('APPS_TWITTER_NEW_BROADCAST', { profile_name }),
            onClick: () => history.push('/twitter'),
            content: message,
            icon,
            notificationIcon,
          },
          true,
          {
            title: t('APPS_TWITTER_UNREAD_MESSAGES', {
              count: unread,
            }),
            content: null,
          },
        );
        return unread;
      });
    },
    [setUnreadCount, addNotificationAlert, t, icon, notificationIcon, history],
  );

  return { setNotification, setUnreadCount, unreadCount };
};
