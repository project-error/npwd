import defaultConfig from '../../../../config.default.json';
import { ResourceConfig } from '@typings/config';
import { getResourceName } from './misc';
import { deepMergeObjects } from '@shared/deepMergeObjects';

export const fetchConfig = async (): Promise<ResourceConfig> => {
  const resourceName = getResourceName();
  const config = await fetch(`https://cfx-nui-${resourceName}/config.json`)
    .then(async (res) => {
      return await res.json();
    })
    .catch((err) => {
      console.error('Could not find a config file!', err);
    });

  return deepMergeObjects({}, defaultConfig, config);
};

export enum EnvMode {
  GAME = 'game',
  DEV = 'dev',
  PROD = 'production',
}
