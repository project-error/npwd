import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { DEFAULT_ALERT_HIDE_TIME } from '@os/notifications/notifications.constants';
import { phoneState } from './state';

export const usePhoneVisibility = () => {
  const [visibility, setVisibility] = useRecoilState(phoneState.visibility);
  const { currentAlert } = useNotifications();
  const [{ zoom }] = useSettings();

  const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

  const notificationTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (visibility) {
      setNotifVisibility(false);
    }
  }, [visibility]);

  useEffect(() => {
    if (!visibility && currentAlert) {
      setNotifVisibility(true);
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
        notificationTimer.current = undefined;
      }
      if (currentAlert?.keepWhenPhoneClosed) {
        return;
      }
      notificationTimer.current = setTimeout(() => {
        setNotifVisibility(false);
      }, DEFAULT_ALERT_HIDE_TIME);
    }
  }, [currentAlert, visibility, setVisibility]);

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
