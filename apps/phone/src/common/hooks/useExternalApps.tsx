import { IApp } from '@os/apps/config/apps';
import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { createExternalAppProvider } from '@os/apps/utils/createExternalAppProvider';
import { useRecoilState, useRecoilValue } from 'recoil';
import { phoneState } from '@os/phone/hooks/state';

import {
  __federation_method_getRemote,
  __federation_method_setRemote,
  __federation_method_unwrapDefault,
  // @ts-ignore - This is Vite federation magic
} from '__federation__';

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

  const generateAppConfig = async (appName: string): Promise<IApp> => {
    try {
      const IN_GAME = import.meta.env.PROD || import.meta.env.REACT_APP_IN_GAME;
      const url = IN_GAME
        ? `https://cfx-nui-${appName}/web/dist/remoteEntry.js`
        : 'http://localhost:4173/assets/remoteEntry.js';
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

      const appConfig = m();
      const config = appConfig;
      config.Component = (props: object) => React.createElement(config.app, props);

      const Provider = createExternalAppProvider(config);

      config.Route = (props: any) => {
        return (
          <Route path={config.path}>
            <Provider>
              <config.Component {...props} />
            </Provider>
          </Route>
        );
      };

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
  };

  const getConfigs = async (externalApps: string[] = []) => {
    const configs = await Promise.all(
      externalApps.map(async (appName) => {
        const app = await generateAppConfig(appName);
        if (!app) return null;
        return app;
      }),
    );

    return configs;
  };

  return {
    getConfigs,
  };
};

interface ReloadEvent {
  type: 'RELOAD';
  payload: 'string';
}

export const useExternalApps = () => {
  const [apps, setApps] = useRecoilState(phoneState.extApps);
  const { getConfigs } = useExternalAppsAction();
  const config = useRecoilValue(phoneState.resourceConfig);

  const handleReloadApp = (message: MessageEvent<ReloadEvent>) => {
    const { data } = message;
    if (data.type === 'RELOAD') {
      getConfigs(config.apps).then(setApps);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleReloadApp);
    return () => {
      window.removeEventListener('message', handleReloadApp);
    };
  }, []);

  useEffect(() => {
    getConfigs(config?.apps).then(setApps);
  }, [config]);

  return apps.filter((app) => app);
};
