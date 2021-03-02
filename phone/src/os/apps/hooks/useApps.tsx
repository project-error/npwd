import { useCallback, useMemo } from 'react';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { APPS, IAppConfig } from '../config/apps';

export const useApps = () => {
  const { icons } = useNotifications();
  const apps = useMemo(
    () =>
      APPS.map((a) => ({
        ...a,
        notification: icons.find((i) => i.key === a.id),
      })),
    [icons],
  );
  const getApp = useCallback((id: string): IAppConfig => apps.find((a) => a.id === id) || null, [
    apps,
  ]);
  return { apps, getApp };
};

export const useApp = (id: string): IAppConfig => {
  const { getApp } = useApps();
  return getApp(id);
};
