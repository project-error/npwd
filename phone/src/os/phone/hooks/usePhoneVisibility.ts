import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { phoneState } from './state';
import { useNotifications } from '../../new-notifications/hooks/useNotifications';

export const usePhoneVisibility = () => {
  const visibility = useRecoilValue(phoneState.visibility);
  const { activeNotis } = useNotifications();
  const [{ zoom }] = useSettings();

  const [notifVisibility, setNotifVisibility] = useState<boolean>(false);

  useEffect(() => {
    if (activeNotis && !visibility) {
      setNotifVisibility(true);
    } else {
      setNotifVisibility(false);
    }
  }, [activeNotis, visibility]);

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
