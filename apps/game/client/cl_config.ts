import { ResourceConfig } from '@typings/config';
import { deepMergeObjects } from '@shared/deepMergeObjects';
import defaultConfig from '../../../config.default.json';

// Setup and export the config for the resource
export const config = (() => {
  const resourceName = GetCurrentResourceName();
  const config: ResourceConfig = JSON.parse(LoadResourceFile(resourceName, 'config.json'));

  let phoneAsItem = GetConvar('npwd:phoneAsItem', '') as string;
  if (phoneAsItem !== '') {
    phoneAsItem = JSON.parse(phoneAsItem) as any;
    Object.entries(config.PhoneAsItem).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (phoneAsItem[key] && typeof value === typeof phoneAsItem[key]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.PhoneAsItem[key] = phoneAsItem[key];
      }
    });
  }

  return deepMergeObjects({}, defaultConfig, config) as any;
})();
