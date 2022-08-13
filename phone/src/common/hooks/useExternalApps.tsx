import { IApp } from '@os/apps/config/apps';
import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { useSettings } from '@apps/settings/hooks/useSettings';
import { useCustomEvent } from '@os/events/useCustomEvents';
import { QuestionMark } from '@mui/icons-material';

import externalApps from '../../../../config.apps';
import { createTheme } from '@mui/material';
import { deepMergeObjects } from '@shared/deepMergeObjects';

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
  const generateAppConfig = async (
    importStatement: CallableFunction,
    id: string,
  ): Promise<IApp> => {
    try {
      const rawConfig = (await importStatement()).default;
      console.log('what is rawConfig', rawConfig);
      if (typeof rawConfig === 'object') return;
      const config = typeof rawConfig === 'function' ? rawConfig({ language: 'sv' }) : rawConfig;

      config.Component = (props: object) => React.createElement(config.app, props);

      config.icon = React.createElement(config.icon);

      config.Route = (props: object) => {
        const appTheme = createTheme(deepMergeObjects(props.theme, config.theme));
        const newProps = { ...props, theme: appTheme };
        return (
          <Route path={config.path}>
            <config.Component {...newProps} />
          </Route>
        );
      };

      return config;
    } catch (error: unknown) {
      console.error('Failed to load external app.', error);
      return null;
    }
  };

  const getConfigs = async (externalApps: Record<string, CallableFunction>) => {
    const configs = await Promise.all(
      Object.entries(externalApps).map(async ([key, value]) => {
        const app = await generateAppConfig(value, key);
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

  const handleReloadApp = (message: MessageEvent<ReloadEvent>) => {
    const { data } = message;
    if (data.type === 'RELOAD') {
      getConfigs(externalApps).then(setApps);
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
    getConfigs(externalApps).then(setApps);
  }, []);

  return apps.filter((app) => app);
};
