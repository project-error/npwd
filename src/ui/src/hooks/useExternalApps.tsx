import { createElement, ReactNode, useCallback, useEffect, useState } from 'react';
import {
  Outlet,
  Route,
  RouteObject,
  RouteProps,
  RouterProps,
  RouterProviderProps,
  RoutesProps,
} from 'react-router-dom';
// import { createExternalAppProvider } from '@os/apps/utils/createExternalAppProvider';
// import { useRecoilState, useRecoilValue } from 'recoil';
// import { phoneState } from '@os/phone/hooks/state';

import {
  __federation_method_getRemote,
  __federation_method_setRemote,
  __federation_method_unwrapDefault,
  // @ts-ignore - This is virtual modules from the vite plugin. I guess they forgot to add defs.
} from '__federation__';
import { useSetRoutes } from './useRouter';

interface IApp {
  id: string;
  path: string;
  Icon: ReactNode;
  Component: (props: { settings: unknown }) => ReactNode;
  router: RouterProviderProps['router'];
  routes: RouteObject[];
  name: string;
}

const useExternalAppsAction = () => {
  const loadScript = async (url: string) => {
    await new Promise((resolve, reject) => {
      const element = document.createElement('script');

      element.src = url;
      element.type = 'text/javascript';
      element.async = true;

      document.head.appendChild(element);

      element.onload = (): void => {
        resolve(true);
      };

      element.onerror = (error) => {
        element.parentElement?.removeChild(element);
        reject(error);
      };
    });
  };

  const generateAppConfig = useCallback(async (appName: string): Promise<IApp | null> => {
    try {
      const IN_GAME = false;
      const url = IN_GAME
        ? `https://cfx-nui-${appName}/web/dist/remoteEntry.js`
        : 'http://localhost:4173/remoteEntry.js';
      const scope = appName;

      await loadScript(url);

      console.log(`Loading external app "${appName}" .. `);

      __federation_method_setRemote(scope, {
        url: () => Promise.resolve(url),
        format: 'esm',
        from: 'vite',
      });

      const mWrapper = await __federation_method_getRemote(scope, './config');
      const m = await __federation_method_unwrapDefault(mWrapper);

      const appConfig = m();
      const config = appConfig;
      config.Component = (props: object) => createElement(config.app, props);
      config.ico = (props: object) => createElement(config.icon, props);
      // config.Component = () => <span>hi</span>;
      // const Provider = createExternalAppProvider(config);

      config.Route = (props: any) => {
        return (
          // <Route path={config.path}>
          <config.Component {...props} />
          // </Route>
        );
      };

      config.Icon = createElement(config.icon);
      config.NotificationIcon = config.notificationIcon;

      console.log({ config });

      console.debug(`Successfully loaded external app "${appName}"`);
      return config;
    } catch (error: unknown) {
      console.error(
        `Failed to load external app "${appName}". Make sure it is started before NPWD.`,
      );
      console.error(error);

      return null;
    }
  }, []);

  const getConfigs = useCallback(
    async (externalApps: string[], existingApps: IApp[]) => {
      const appAlreadyLoaded = (appName: string) => {
        return existingApps.find((app) => app?.id === appName);
      };

      const configs = await Promise.all(
        externalApps.map(async (appName) => {
          return appAlreadyLoaded(appName) ?? (await generateAppConfig(appName));
        }),
      );

      return configs;
    },
    [generateAppConfig],
  );

  return {
    getConfigs,
  };
};

const extendRoutesWithApp = (routes: RouteObject[], app: IApp) => {
  const [baseRoute, ...restRoutes] = routes;

  if (!baseRoute) {
    throw new Error('No base route provided');
  }

  const appsRoute = baseRoute.children?.find((route) => route.path === 'apps');
  if (!appsRoute) {
    throw new Error('No route found for app');
  }

  /** Check if route is already there. */
  const appRoute = appsRoute.children?.find((route) => route.path === app.path.replace('/', ''));

  if (appRoute) {
    console.log('App route already exists');
    return routes;
  }

  appsRoute.children = [
    ...(appsRoute.children ?? []),
    {
      path: app.path.replace('/', ''),
      element: <Outlet />,
      children: [...(app.routes[0].children ?? [])],
    },
  ];

  console.log({ routes: app.routes, children: app.routes[0].children });

  console.log({ appsRoute });

  return [baseRoute, ...restRoutes];
};

export const useExternalApps = () => {
  const [apps, setApps] = useState<(IApp | null)[]>([]);
  const { getConfigs } = useExternalAppsAction();
  const setRoutes = useSetRoutes();

  useEffect(() => {
    getConfigs(
      ['send_app'],
      apps.filter((app) => app !== null),
    ).then(setApps);
  }, [setApps, getConfigs]);

  useEffect(() => {
    apps.forEach((app) => {
      if (!app) return;
      setRoutes((routes) => extendRoutesWithApp(routes, app));
    });
  }, [setRoutes]);

  return apps.filter((app) => app);
};
