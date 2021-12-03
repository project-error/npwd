import ClientUtils from './cl_utils';
import { ResourceConfig } from '../../typings/config';

// Setup and export the config for the resource
export const config: ResourceConfig = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);

import './cl_main';
import './cl_twitter';
import './cl_contacts';
import './cl_marketplace';
import './cl_notes';
import './cl_photo';
import './cl_messages';
import './calls/cl_calls.controller';
import './cl_match';
import './functions';
import './cl_exports';

export const ClUtils = new ClientUtils();
