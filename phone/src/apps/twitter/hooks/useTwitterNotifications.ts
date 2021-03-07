import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Tweet } from '../../../common/typings/twitter';
import { useRecoilState, useRecoilValue } from 'recoil';

import { useApp } from '../../../os/apps/hooks/useApps';
import { useNotifications } from '../../../os/notifications/hooks/useNotifications';
import { useSettings } from '../../settings/hooks/useSettings';
import { SETTING_MENTIONS } from '../utils/constants';
import { twitterState } from './state';

const NOTIFICATION_ID = 'twitter:broadcast';

function isMentioned(profileName: string, message: string) {
  return !message.toLowerCase().includes(profileName.toLowerCase());
}

export const useTwitterNotifications = () => {
  const [settings] = useSettings();
  const { t } = useTranslation();
  const history = useHistory();

  const { addNotificationAlert, addNotification, hasNotification, removeId } = useNotifications();

  const { icon, notificationIcon } = useApp('TWITTER');

  const [unreadCount, setUnreadCount] = useRecoilState(twitterState.unreadTweetsCount);
  const profile = useRecoilValue(twitterState.profile);

  const setNotification = ({ profile_name, message, isRetweet }) => {
    const titleStr = isRetweet
      ? 'APPS_TWITTER_NEW_RETWEET_BROADCAST'
      : 'APPS_TWITTER_NEW_BROADCAST';

    const currentProfileName = profile.profile_name;
    // we don't want notifications of our own tweets
    if (currentProfileName === profile_name) return;

    // if the player only wants notifications on tweets they are
    // mentioned in
    if (
      settings.TWITTER_notiFilter.value === SETTING_MENTIONS &&
      isMentioned(currentProfileName, message)
    )
      return;

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
