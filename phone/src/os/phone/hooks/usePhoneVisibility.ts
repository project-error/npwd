import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { DEFAULT_ALERT_HIDE_TIME } from '../../notifications/notifications.constants';
import { phoneState } from './state';

export const usePhoneVisibility = () => {
  const [visibility, setVisibility] = useRecoilState(phoneState.visibility);
  const { currentAlert } = useNotifications();
  const [{ zoom }] = useSettings();

  const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

  const [isNotificationVisibleOnly, setNotificationVisibleOnly] = useState<
    boolean
  >(false);

  useEffect(() => {
    setNotificationVisibleOnly(!!(!visibility && currentAlert));
  }, [visibility, currentAlert]);

  const notificationTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isNotificationVisibleOnly) {
      setNotifVisibility(true);
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
        notificationTimer.current = undefined;
      }
      notificationTimer.current = setTimeout(() => {
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

  return {
    bottom,
    visibility: notifVisibility || visibility,
  };
};
