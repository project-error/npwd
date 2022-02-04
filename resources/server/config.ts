// Setup and export config loaded at runtime
import { ResourceConfig } from '../../typings/config';

export const config = (() => {
  let config: ResourceConfig = JSON.parse(
    LoadResourceFile(GetCurrentResourceName(), 'config.json'),
  );

  let database = GetConvar('npwd:database', '') as string;
  if (database !== '') {
    database = JSON.parse(database) as any;
    Object.entries(config.database).forEach(([key, value]) => {
      // @ts-ignore
      if (database[key] && typeof value === typeof database[key]) {
        // @ts-ignore
        config.database[key] = database[key];
      }
    });
  }

  if (GetConvar('npwd:useResourceIntegration', '') == 'true') {
    config.general.useResourceIntegration = true;
  }

  return config;
})();
