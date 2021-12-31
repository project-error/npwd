import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { phoneState } from './state';
import { activeNotificationsIds } from '@os/new-notifications/state/notifications.state';

export const usePhoneVisibility = () => {
  const visibility = useRecoilValue(phoneState.visibility);
  const activeNotifications = useRecoilValue(activeNotificationsIds);
  const [{ zoom }] = useSettings();

  const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

  useEffect(() => {
    if (activeNotifications.length && !visibility) {
      setNotifVisibility(true);
    } else {
      setNotifVisibility(false);
    }
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
