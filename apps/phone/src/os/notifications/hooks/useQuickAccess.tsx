import { useCallback, useEffect } from 'react';
import { matchPath, useLocation } from 'react-router';
import { atom, useAtom } from 'jotai';
import { IAppConfig } from '@os/apps/config/apps';
import { useApps } from '@os/apps/hooks/useApps';

const state = {
  recentlyUsed: atom<IAppConfig[]>([]),
};

const MAX_QUICK_ACCESS_ITEMS = 5;

const unshiftApp = (arr: IAppConfig[], app) => {
  const idx = arr.findIndex((a) => a.id === app.id);
  if (idx !== -1) {
    arr.splice(idx, 1);
  }
  arr.unshift(app);
  return arr;
};

export const useQuickAccess = () => {
  const location = useLocation();
  const { apps, getApp } = useApps();
  const [recentlyUsed, setRecentlyUsed] = useAtom(state.recentlyUsed);

  useEffect(() => {
    setRecentlyUsed([getApp('SETTINGS')]);
  }, [getApp, setRecentlyUsed]);

  const listener = useCallback(
    (pathname: string) => {
      const newState = [...recentlyUsed];
      apps.forEach((app) => {
        if (matchPath({ path: app.path, end: true }, pathname)) {
          unshiftApp(newState, app);
        }
      });
      setRecentlyUsed(newState.slice(0, MAX_QUICK_ACCESS_ITEMS));
    },
    [apps, recentlyUsed, setRecentlyUsed],
  );

  useEffect(() => {
    listener(location.pathname);
  }, [listener, location.pathname]);

  return recentlyUsed;
};
