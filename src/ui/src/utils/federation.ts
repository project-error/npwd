import { App } from '@/contexts/AppsContext';
import {
  __federation_method_getRemote,
  __federation_method_setRemote,
  __federation_method_unwrapDefault,
  // @ts-expect-error - This is virtual modules from the vite plugin. I guess they forgot to add defs.
} from '__federation__';
import { createElement, ReactNode } from 'react';
import { RouteObject } from 'react-router';

export interface RemoteApp extends App {
  id: string;
  name: string;
  path: string;

  routes: RouteObject[];
  Icon: ReactNode;
  Component: (props: { settings: unknown }) => ReactNode;
}

export const generateAppConfig = async (appName: string): Promise<App | null> => {
  try {
    const scope = appName;
    const IN_GAME = false;
    const url = IN_GAME
      ? `https://cfx-nui-${appName}/web/dist/remoteEntry.js`
      : 'http://localhost:4173/remoteEntry.js';

    console.log(`Loading external app "${appName}" .. `);

    __federation_method_setRemote(scope, {
      url: () => Promise.resolve(url),
      format: 'esm',
      from: 'vite',
    });

    const remoteAppConfig = await __federation_method_getRemote(scope, './config');
    const externalAppModule = await __federation_method_unwrapDefault(remoteAppConfig);

    const appConfig = externalAppModule();
    const config = appConfig;

    config.Component = (props: object) => createElement(config.app, props);
    config.Icon = createElement(config.icon);
    config.NotificationIcon = config.notificationIcon;

    console.debug(`Successfully loaded external app "${appName}"`);
    return config;
  } catch (error: unknown) {
    console.error(`Failed to load external app "${appName}". Make sure it is started before NPWD.`);
    console.error(error);

    return null;
  }
};

export const mergeAppIntoRoutes = (routes: RouteObject[], app: RemoteApp) => {
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

  const baseAppRoute = app.routes[0];
  const appRoutes = baseAppRoute.children ?? [];

  if (!appRoutes.length) {
    throw new Error('No routes provided for app');
  }

  appsRoute.children = [
    ...(appsRoute.children ?? []),
    {
      ...baseAppRoute,
      id: app.id ?? app.path.replace('/', ''),
      path: app.path.replace('/', ''),
    },
  ];

  return [baseRoute, ...restRoutes];
};

export const retrieveExternalAppConfigs = async (externalAppNames: string[]) => {
  const configs = await Promise.all(
    externalAppNames.map(async (appName) => await generateAppConfig(appName)),
  );

  return configs;
};
