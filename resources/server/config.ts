// Setup and export config loaded at runtime
import { ResourceConfig } from '../../typings/config';

export const config: ResourceConfig = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);
