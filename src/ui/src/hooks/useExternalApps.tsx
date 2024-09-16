import { App } from '@/contexts/AppsContext';
import { mergeAppIntoRoutes, RemoteApp, retrieveExternalAppConfigs } from '@/utils/federation';
import { useState } from 'react';
import { useEffectOnce } from './useEffectOnce';
import { useRoutes } from './useRouter';

export const useExternalApps = (): {
  apps: App[];
  hasLoaded: boolean;
} => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const { setRoutes, routes } = useRoutes();

  useEffectOnce(() => {
    const init = async () => {
      /**
       * TODO: Decide where this information should be retrieved from. The server?
       */
      const configs = await retrieveExternalAppConfigs(['send_app']);
      const remoteApps = configs.filter((config) => config !== null) as RemoteApp[];

      remoteApps.forEach((app) => {
        if (!app?.routes || !routes.length) return;
        setHasLoaded(true);
        setRoutes(mergeAppIntoRoutes(routes, app));
        setApps((prevApps) => [...prevApps, app]);
      });
    };

    init();
  });

  return {
    apps,
    hasLoaded,
  };
};
