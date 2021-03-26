import { Server } from 'esx.js';

import './db';
import './sv_twitter';
import './sv_main';
import './sv_contacts';
import './sv_sellout';
import './sv_bank';
import './sv_notes';
import './sv_photo';
import './sv_messages';
import './sv_match';
import './sv_call';
import './players/sv_player_events';
import { mainLogger } from './sv_logger';

export let ESX: Server = null;

emit('esx:getSharedObject', (obj: Server) => (ESX = obj));

on('onServerResourceStart', (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    mainLogger.info('Sucessfully started');
  }
});
