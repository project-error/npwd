import { useCurrentCallValue } from '@os/call/hooks/state';
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
  const currentCall = useCurrentCallValue();

  const hasNotis = currentCall || activeNotifications.length;

  useEffect(() => {
    if (hasNotis && !visibility) {
      console.log('activeNotificationsIds', activeNotifications);
      setNotifVisibility(true);
    } else {
      setNotifVisibility(false);
    }
  }, [hasNotis, activeNotifications, visibility]);

  const bottom = useMemo(() => {
    if (!visibility) {
      return `${-750 * zoom.value}px`;
    }
    return '0px';
  }, [visibility, zoom]);

  return {
    bottom,
    visibility: notifVisibility || visibility,
  };
};
