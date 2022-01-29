import { useTranslation } from 'react-i18next';
import { useSettings } from '../../settings/hooks/useSettings';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { MarketplaceListing } from '@typings/marketplace';
import { useApp } from '@os/apps/hooks/useApps';
import { INotification } from '@os/notifications/providers/NotificationsProvider';

const NOTIFICATION_ID = 'marketplace:broadcast';

export const useMarketplaceNotifications = () => {
  const [t] = useTranslation();
  const [settings] = useSettings();
  const { addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('MARKETPLACE');

  const setNotification = (listing: MarketplaceListing) => {
    if (!settings.MARKETPLACE_notifyNewListing) return;

    const id = `${NOTIFICATION_ID}:${listing.id}`;

    const notification: INotification = {
      app: 'MARKETPLACE',
      id,
      title: t('MARKETPLACE.NEW_LISTING'),
      content: listing.description,
      icon,
      notificationIcon,
    };

    addNotificationAlert(notification);
  };

  return { setNotification };
};
