import { IApp } from '@os/apps/config/apps';
import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { createExternalAppProvider } from '@os/apps/utils/createExternalAppProvider';
import { useRecoilState, useRecoilValue } from 'recoil';
import { phoneState } from '@os/phone/hooks/state';

const useExternalAppsAction = () => {
  const loadScript = async (url, scope, module) => {
    await new Promise((resolve, reject) => {
      const element = document.createElement('script');

      element.src = url;
      element.type = 'text/javascript';
      element.async = true;

      element.onload = (): void => {
        element.parentElement.removeChild(element);
        resolve(true);
      };
      element.onerror = (error) => {
        element.parentElement.removeChild(element);
        reject(error);
      };

      document.head.appendChild(element);
    });
  };

  const generateAppConfig = async (appName: string): Promise<IApp> => {
    try {
      const IN_GAME = process.env.NODE_ENV === 'production' || process.env.REACT_APP_IN_GAME;
      const url = IN_GAME
        ? `https://cfx-nui-${appName}/web/dist/remoteEntry.js`
        : 'http://localhost:3002/remoteEntry.js';
      const scope = appName;
      const module = './config';

      await loadScript(url, scope, module);

      await __webpack_init_sharing__('default');
      const container = window[scope];

      await container.init(__webpack_share_scopes__.default);
      const factory = await window[scope].get(module);
      const Module = factory();

      const appConfig = Module.default();

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
