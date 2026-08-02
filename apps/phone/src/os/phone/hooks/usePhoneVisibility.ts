import { useCurrentCallValue } from '@os/call/hooks/state';
import { useActiveNotificationIds } from '@os/new-notifications/state';
import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { isEnvBrowser } from '../../../utils/misc';
import { phoneState } from './state';

export const usePhoneVisibility = () => {
  const visibility = useAtomValue(phoneState.visibility);
  const [{ zoom }] = useSettings();
  const activeNotifications = useActiveNotificationIds();
  const [notifVisibility, setNotifVisibility] = useState<boolean>(false);
  const currentCall = useCurrentCallValue();

  const hasNotis = currentCall || activeNotifications.length;

  useEffect(() => {
    if (hasNotis && !visibility) {
      setNotifVisibility(true);
    } else {
      setNotifVisibility(false);
    }
  }, [hasNotis, activeNotifications, visibility]);

  const bottom = useMemo(() => {
    if (!visibility && !isEnvBrowser()) {
      return `${-750 * zoom.value}px`;
    }
    return '0px';
  }, [visibility, zoom]);

  return {
    bottom,
    visibility: notifVisibility || visibility || isEnvBrowser(),
  };
};