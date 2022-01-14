import { ResourceConfig } from '../../typings/config';

// Setup and export the config for the resource
export const config: ResourceConfig = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);
