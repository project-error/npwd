import { IApp } from '@os/apps/config/apps';
import React from 'react';
import { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
const externalApps = require('../../../../config.apps');

const generateAppConfig = async (importStatement): Promise<IApp> => {
  const rawConfig = (await importStatement()).default;
  const config = typeof rawConfig === 'function' ? rawConfig({ language: 'sv' }) : rawConfig;

  const Component = React.createElement(config.app, {
    settings: { language: 'en', isDarkMode: true },
  });

  config.Component = Component;
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

interface ReloadEvent {
  type: 'RELOAD';
  payload: 'string';
}

export const useExternalApps = () => {
  const [apps, setApps] = useState<IApp[]>([]);

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
