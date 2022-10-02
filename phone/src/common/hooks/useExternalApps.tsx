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

  const loadJS = (url, fn) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = fn;
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  const scriptTypes = ['var'];
  const importTypes = ['esm', 'systemjs'];

  async function __federation_import(name) {
    return __vitePreload(() => import(name), true ? [] : void 0);
  }

  var __federation__ = {
    ensure: async (remoteId) => {
      const remote = remoteId;
      if (!remote.inited) {
        if (scriptTypes.includes(remote.format)) {
          // loading js with script tag
          return new Promise((resolve) => {
            const callback = () => {
              if (!remote.inited) {
                remote.lib = window[remoteId];
                remote.lib.init(shareScope);
                remote.inited = true;
              }
              resolve(remote.lib);
            };
            loadJS(remote.url, callback);
          });
        } else if (importTypes.includes(remote.format)) {
          // loading js with import(...)
          return new Promise((resolve) => {
            __vitePreload(() => import(/* @vite-ignore */ remote.url), true ? [] : void 0).then(
              (lib) => {
                if (!remote.inited) {
                  lib.init(shareScope);
                  remote.lib = lib;
                  remote.lib.init(shareScope);
                  remote.inited = true;
                }
                resolve(remote.lib);
              },
            );
          });
        }
      } else {
        return remote.lib;
      }
    },
  };

  const generateAppConfig = async (appName: string): Promise<IApp> => {
    try {
      const IN_GAME = import.meta.env.PROD || import.meta.env.REACT_APP_IN_GAME;
      const url = IN_GAME
        ? `https://cfx-nui-${appName}/web/dist/remoteEntry.js`
        : 'http://localhost:3002/remoteEntry.js';
      const scope = appName;
      const module = './config';

      const fed = __federation__.ensure(appName).then((remote) => console.log(remote));
      console.log('FED', fed);

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
