import { IApp } from '@os/apps/config/apps';
import React, { useCallback, useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { phoneState } from '@os/phone/hooks/state';

import {
  __federation_method_getRemote,
  __federation_method_setRemote,
  __federation_method_unwrapDefault,
  // @ts-ignore - This is virtual modules from the vite plugin. I guess they forgot to add defs.
} from '__federation__';
import { EnvMode } from '@utils/config';

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
        element.parentElement.removeChild(element);
        reject(error);
      };
    });
  };

  const generateAppConfig = useCallback(async (appName: string): Promise<IApp> => {
    try {
      const IN_GAME = import.meta.env.PROD || import.meta.env.MODE === EnvMode.GAME;
      const url = IN_GAME
        ? `https://cfx-nui-${appName}/web/dist/remoteEntry.js`
        : 'http://localhost:4173/remoteEntry.js';
      const scope = appName;

      await loadScript(url);

      console.log('Loaded external app', appName);

      __federation_method_setRemote(scope, {
        url: () => Promise.resolve(url),
        format: 'esm',
        from: 'vite',
      });

      const mWrapper = await __federation_method_getRemote(scope, './config');
      const m = await __federation_method_unwrapDefault(mWrapper);

      const config = m();
      config.Component = (props: object) => React.createElement(config.app, props);
      config.icon = React.createElement(config.icon);
      config.NotificationIcon = config.notificationIcon;

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
        return existingApps.find((app) => app.id === appName);
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

export const useExternalApps = () => {
  const [apps, setApps] = useAtom(phoneState.extApps);
  const appsRef = useRef(apps);
  const { getConfigs } = useExternalAppsAction();
  const config = useAtomValue(phoneState.resourceConfig);

  useEffect(() => {
    appsRef.current = apps;
  }, [apps]);

  useEffect(() => {
    if (!config?.apps?.length) {
      return;
    }

    let cancelled = false;

    getConfigs(config.apps, appsRef.current).then((nextApps) => {
      if (!cancelled) {
        setApps(nextApps);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [config?.apps, setApps, getConfigs]);

  return apps.filter((app) => app);
};
