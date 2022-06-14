import { IApp } from '@os/apps/config/apps';
import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const externalApps = require('../../../../config.apps');

const useExternalAppsAction = () => {
  const theme = useTheme();

  const generateAppConfig = async (importStatement): Promise<IApp> => {
    const rawConfig = (await importStatement()).default;
    const config = typeof rawConfig === 'function' ? rawConfig({ language: 'sv' }) : rawConfig;

    config.Component = React.createElement(config.app, {
      settings: { language: 'en', theme },
    });
    config.icon = React.createElement(config.icon);

    config.Route = <Route path={config.path}>{config.Component}</Route>;

    return config;
  };

  const getConfigs = async (communityApps) => {
    const configs = await Promise.all(
      Object.entries(communityApps).map(async ([key, value]) => {
        const app = await generateAppConfig(value);
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

  const handleReloadApp = (message: MessageEvent<ReloadEvent>) => {
    const { data } = message;
    if (data.type === 'RELOAD') {
      getConfigs(externalApps).then(setApps);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleReloadApp);
    return () => {
      window.removeEventListener('message', handleReloadApp);
    };
  }, []);

  useEffect(() => {
    getConfigs(externalApps).then(setApps);
  }, []);

  return apps;
};
