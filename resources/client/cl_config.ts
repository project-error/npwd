import { ResourceConfig } from '../../typings/config';

// Setup and export the config for the resource
export const config = (() => {
  let config: ResourceConfig = JSON.parse(
    LoadResourceFile(GetCurrentResourceName(), 'config.json'),
  );

  let phoneAsItem = GetConvar('npwd:phoneAsItem', '') as string;
  if (phoneAsItem !== '') {
    phoneAsItem = JSON.parse(phoneAsItem) as any;
    Object.entries(config.PhoneAsItem).forEach(([key, value]) => {
      // @ts-ignore
      if (phoneAsItem[key] && typeof value === typeof phoneAsItem[key]) {
        // @ts-ignore
        config.PhoneAsItem[key] = phoneAsItem[key];
      }
    });
  }

  return config;
})();
