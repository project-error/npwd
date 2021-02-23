import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { DEFAULT_ALERT_HIDE_TIME } from '../../notifications/notifications.constants';
import { usePhone } from './usePhone';

export const usePhoneVisibility = () => {
  const { setVisibility, visibility } = usePhone();
  const { currentAlert } = useNotifications();
  const [{ zoom }] = useSettings();

  const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

  const isNotificationVisibleOnly = useMemo(
    () => !!(!visibility && currentAlert),
    [visibility, currentAlert]
  );

  const notificationTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isNotificationVisibleOnly) {
      setNotifVisibility(true);
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
        notificationTimer.current = undefined;
      }
      notificationTimer.current = setTimeout(() => {
        setVisibility(false);
        setNotifVisibility(false);
      }, DEFAULT_ALERT_HIDE_TIME);
    }
    return () => {
      clearTimeout(notificationTimer.current);
      notificationTimer.current = undefined;
    };
  }, [isNotificationVisibleOnly, setVisibility]);

  const bottom = useMemo(() => {
    if (isNotificationVisibleOnly) {
      return `calc(-70% * ${zoom})`;
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
    visibility: notifVisibility || visibility,
    clickEventOverride,
  };
};
