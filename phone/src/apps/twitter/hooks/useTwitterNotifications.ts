import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Tweet } from '../../../common/typings/twitter';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useNotifications } from '../../../os/notifications/hooks/useNotifications';
import { twitterState } from './state';

const NOTIFICATION_ID = 'twitter:broadcast';

export const useTwitterNotifications = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const {
    addNotificationAlert,
    addNotification,
    hasNotification,
    removeId,
  } = useNotifications();

  const { icon, notificationIcon } = useApp('TWITTER');

  const [unreadCount, setUnreadCount] = useRecoilState(twitterState.unreadTweetsCount);

  const setNotification = ({ profile_name, message, isRetweet }) => {
    const titleStr = isRetweet 
      ? 'APPS_TWITTER_NEW_RETWEET_BROADCAST'
      : 'APPS_TWITTER_NEW_BROADCAST';
    const notification = {
      app: 'TWITTER',
      id: NOTIFICATION_ID,
      sound: true,
      title: t(titleStr, { profile_name }),
      onClick: () => history.push('/twitter'),
      content: message,
      icon,
      notificationIcon,
    };
    const newCount = unreadCount + 1;
    setUnreadCount(newCount);
    addNotificationAlert(notification);
    if (hasNotification(NOTIFICATION_ID)) {
      removeId(NOTIFICATION_ID);
      addNotification({
        ...notification,
        title: t('APPS_TWITTER_UNREAD_MESSAGES', {
          count: newCount,
        }),
        content: null,
      });
      return;
    }
    addNotification(notification);
  };

  return { setNotification, setUnreadCount, unreadCount };
};
