import { activeNotificationIds } from '@os/new-notifications/state';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { phoneState } from './state';

export const usePhoneVisibility = () => {
  const visibility = useRecoilValue(phoneState.visibility);
  const [{ zoom }] = useSettings();
  const activeNotifications = useRecoilValue(activeNotificationIds);
  const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

  useEffect(() => {
    let timer = null;
    if (activeNotifications.length && !visibility) {
      setNotifVisibility(true);
      timer = setTimeout(() => {
        setNotifVisibility(false);
      }, 3000);
    } else {
      setNotifVisibility(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [activeNotifications, visibility]);

  const bottom = useMemo(() => {
    if (!visibility) {
      return `${-728 * zoom.value}px`;
    }
    return '0px';
  }, [visibility, zoom]);

  return {
    bottom,
    visibility: notifVisibility || visibility,
  };
};
