import { IAppConfig } from '@os/apps/config/apps';
import React from 'react';
import { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
const communityApps = require('../../../../communityApps');

const generateAppConfig = async (importStatement): Promise<IAppConfig> => {
  const rawConfig = (await importStatement()).default;
  const config = typeof rawConfig === 'function' ? rawConfig({ language: 'sv' }) : rawConfig;

  config.Component = React.createElement(config.app, {
    settings: { language: 'en', isDarkMode: true },
  });

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

export const useExternalApps = () => {
  const [apps, setApps] = useState<IAppConfig[]>([]);

  useEffect(() => {
    getConfigs(communityApps).then(setApps);
  }, []);

  return apps;
};
