import { useDisableNavigation } from '@/contexts/NavigationContext';
import { useKeys } from '@/hooks/useKeys';
import { useAnimate } from 'framer-motion';
import { useState } from 'react';
import { NotificationsExtendedList } from './Notification/NotificationsExtendedList';
import { NotificationsPopupList } from './Notification/NotificationsPopupList';

export const Notifications = () => {
  const [isExtendedOpen, setIsExtendedOpen] = useState(false);
  const rootHeight = document.getElementById('root')?.clientHeight;
  const height = rootHeight || 844;

  const [scope, animate] = useAnimate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const updateNotificationState = (isOpen: boolean) => {
    if (isOpen) {
      animate(scope.current, { y: 0 });
    } else {
      animate(scope.current, { y: -height + 32 });
    }

    setIsNotificationsOpen(isOpen);
  };

  useDisableNavigation(isNotificationsOpen);

  useKeys({
    Escape: () => {
      if (isNotificationsOpen) {
        updateNotificationState(false);
      }
    },
    n: () => {
      console.log('n');
      updateNotificationState(!isNotificationsOpen);
      setIsNotificationsOpen(!isNotificationsOpen);
    },
  });

  return (
    <>
      <NotificationsExtendedList onChangeOpen={setIsExtendedOpen} />
      {!isExtendedOpen && <NotificationsPopupList />}
    </>
  );
};
