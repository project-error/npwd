import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { usePhone } from './usePhone';

export const usePhoneVisibility = () => {
  const { setVisibility, visibility } = usePhone();
  const { count } = useNotifications();
  const [{ zoom }] = useSettings();

  const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

  const isNotificationVisibleOnly = useMemo(
    () => !!(!visibility && count > 0),
    [visibility, count]
  );

  const notificationTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isNotificationVisibleOnly) {
      setNotifVisibility(true);
      clearTimeout(notificationTimer.current);
      notificationTimer.current = setTimeout(() => {
        setVisibility(false);
        setNotifVisibility(false);
      }, 5000);
    }
    return () => clearTimeout(notificationTimer.current);
  }, [isNotificationVisibleOnly, setVisibility]);

  const bottom = useMemo(() => {
    if (isNotificationVisibleOnly) {
      return `calc(-60% * ${zoom})`;
    }
    return 0;
  }, [isNotificationVisibleOnly, zoom]);

  const clickEventOverride = useCallback(
    (e) => {
      if (isNotificationVisibleOnly) {
        e.preventDefault();
        e.stopPropagation();
        setVisibility(true);
      }
    },
    [setVisibility, isNotificationVisibleOnly]
  );

  return {
    bottom,
    visibility: notifVisibility,
    uncollapseNotifications: isNotificationVisibleOnly,
    clickEventOverride,
  };
};
