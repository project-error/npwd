import { ResourceConfig } from '../../../typings/config';
import defaultConfig from '../../../config.default.json';
import { deepMergeObjects } from '@shared/deepMergeObjects';

export const getConfig = (): ResourceConfig => {
  const resourceName = GetCurrentResourceName();
  const config: ResourceConfig = JSON.parse(LoadResourceFile(resourceName, 'config.json'));

  return deepMergeObjects({}, defaultConfig, config);
};
