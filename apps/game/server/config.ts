// Setup and export config loaded at runtime
import { getConfig } from './utils/config';

export const config = (() => {
  const config = getConfig();

  let database: Record<string, string> | string = GetConvar('npwd:database', '');
  if (database !== '') {
    database = JSON.parse(database) as Record<string, string>;
    Object.entries(config.database).forEach(([key, value]) => {
      const record = database as Record<string, string>;
      const configDb = config.database as unknown as Record<string, string>;

      if (record[key] && typeof value === typeof record[key]) {
        configDb[key] = record[key];
      }
    });
  }

  if (GetConvar('npwd:useResourceIntegration', '') == 'true') {
    config.general.useResourceIntegration = true;
  }

  return config;
})();
