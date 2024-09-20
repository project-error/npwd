import { Notification } from '@/contexts/NotificationContext';
import { useNotifications } from '@/contexts/NotificationContext/useNotifications';
import { usePrevious } from '@/hooks/usePrevious';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PopupNotification } from './PopupNotification';

export const NotificationsPopupList = () => {
  const { notifications } = useNotifications();
  const [latestNotifications, setLatestNotifications] = useState<Notification[]>([]);

  const previousLength = usePrevious(notifications.length);
  const isNewNotification = previousLength !== undefined && notifications.length > previousLength;

  const handleClearLatest = () => {
    setLatestNotifications([]);
  };

  useEffect(() => {
    if (isNewNotification) {
      setLatestNotifications((prev) => [notifications[0], ...prev].slice(0, 3));
    }
  }, [isNewNotification]);

  const handleRemoveFromLatest = (notificationId: string) => {
    setLatestNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  return (
    <div className="absolute top-8 left-0 right-0 z-10 w-full flex flex-col gap-2 p-4">
      <AnimatePresence>
        {latestNotifications.map((notification, index) => (
          <span key={notification.id}>
            <PopupNotification
              drag={index === 0 ? 'y' : 'x'}
              notification={notification}
              onClose={() => handleRemoveFromLatest(notification.id)}
              onClick={handleClearLatest}
            />
          </span>
        ))}
      </AnimatePresence>
    </div>
  );
};
