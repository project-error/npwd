import ClientUtils from './cl_utils';
import { IServerConfig } from '../../typings/config';

// Setup and export the config for the resource
export const config: IServerConfig = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);

import './cl_main';
import './cl_twitter';
import './cl_contacts';
import './cl_marketplace';
import './cl_bank';
import './cl_notes';
import './cl_photo';
import './cl_messages';
import './cl_call';
import './cl_match';
import './functions';

export const ClUtils = new ClientUtils();
