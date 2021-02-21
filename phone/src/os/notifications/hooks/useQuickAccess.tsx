import { useCallback, useEffect } from 'react';
import { matchPath, useHistory } from 'react-router-dom';
import { atom, useRecoilState } from 'recoil';
import { IAppConfig } from '../../apps/config/apps';
import { useApps } from '../../apps/hooks/useApps';

const state = {
  recentlyUsed: atom({
    key: 'recentlyUsed',
    default: [],
  }),
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
  const history = useHistory();
  const { apps, getApp } = useApps();
  const [recentlyUsed, setRecentlyUsed] = useRecoilState<IAppConfig[]>(
    state.recentlyUsed
  );

  useEffect(() => {
    setRecentlyUsed([getApp('SETTINGS')]);
  }, [getApp, setRecentlyUsed]);

  const listener = useCallback(
    (location) => {
      const newState = [...recentlyUsed];
      apps.forEach((app) => {
        if (matchPath(location.pathname, { path: app.path, exact: true })) {
          unshiftApp(newState, app);
        }
      });
      setRecentlyUsed(newState.slice(0, MAX_QUICK_ACCESS_ITEMS));
    },
    [apps, recentlyUsed, setRecentlyUsed]
  );

  history.listen(listener);

  return recentlyUsed;
};
