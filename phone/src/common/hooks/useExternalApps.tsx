import { IApp } from '@os/apps/config/apps';
import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { useSettings } from '@apps/settings/hooks/useSettings';
import { useCustomEvent } from '@os/events/useCustomEvents';
import { QuestionMark } from '@mui/icons-material';

import externalApps from '../../../../config.apps';
import { createTheme } from '@mui/material';
import { deepMergeObjects } from '@shared/deepMergeObjects';
import { useConfig, usePhone } from '@os/phone/hooks';
import { usePhoneConfig } from 'config/hooks/usePhoneConfig';

const InvalidAppConfig = (id: string): IApp => ({
  id,
  nameLocale: `Invalid external app with id "${id}"`,
  icon: <QuestionMark />,
  Route: () => null,
  backgroundColor: '#222',
  color: '#fff',
  isDisabled: false,
  notification: {
    badge: 0,
    icon: <QuestionMark />,
    key: '',
  },
  NotificationIcon: null,
  notificationIcon: null,
  path: '',
  disable: false,
});

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
      const url = 'http://localhost:3002/remoteEntry.js';
      const scope = appName;
      const module = './config';

      console.log('url', url);
      console.log('scope', scope);
      console.log('module', module);

      await loadScript(url, scope, module);

      await __webpack_init_sharing__('default');
      const container = window[scope];

      console.log('container', container);

      await container.init(__webpack_share_scopes__.default);
      const factory = await window[scope].get(module);
      const Module = factory();

      const appConfig = Module.default();
      console.log('oompa', appConfig);

      const config = appConfig;

      config.Component = (props: object) => React.createElement(config.app, props);

      config.Route = (props: any) => {
        const appTheme = createTheme(deepMergeObjects(props.theme, config.theme));
        const newProps = { ...props, theme: appTheme };
        return (
          <Route path={config.path}>
            <config.Component {...newProps} />
          </Route>
        );
      };

      config.icon = React.createElement(config.icon);

      return config;
    } catch (error: unknown) {
      console.error('Failed to load external app.', error);
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
  const [apps, setApps] = useState<IApp[]>([]);
  const { getConfigs } = useExternalAppsAction();
  const [settings] = useSettings();
  const dispatch = useCustomEvent('initCustomApp', {});
  const { ResourceConfig } = usePhone();

  const handleReloadApp = (message: MessageEvent<ReloadEvent>) => {
    const { data } = message;
    if (data.type === 'RELOAD') {
      getConfigs(ResourceConfig.apps).then(setApps);
    }
  };

  // We need to dispatch the current theme to each app. If we need anything else, we can add it here.
  dispatch({ theme: settings.theme.value });

  useEffect(() => {
    window.addEventListener('message', handleReloadApp);
    return () => {
      window.removeEventListener('message', handleReloadApp);
    };
  }, []);

  useEffect(() => {
    getConfigs(ResourceConfig?.apps).then(setApps);
  }, [ResourceConfig]);

  return apps.filter((app) => app);
};
