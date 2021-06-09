import { Server } from 'esx.js';
import { ResourceConfig } from '../../typings/config';

// Setup and export config loaded at runtime
export const config: ResourceConfig = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);

// Setup controllers
import './db';
import './players/player.controller';
import './calls/calls.controller';
import './notes/notes.controller';
import './contacts/contacts.controller';
import './photo/photo.controller';
import './messages/messages.controller';
import './marketplace/marketplace.controller';
import './twitter/twitter.controller';
import './match/match.controller';

import './sv_main';
import './sv_bank';
import { mainLogger } from './sv_logger';

export let ESX: Server = null;

emit('esx:getSharedObject', (obj: Server) => (ESX = obj));

on('onServerResourceStart', (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    mainLogger.info('Sucessfully started');
  }
});
