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
import './sv_call';
import { mainLogger } from './sv_logger';
import { clearTimeout } from 'timers';

export let esx: Server = null;

emit('esx:getSharedObject', (obj: Server) => (esx = obj));

export const ESX = () => {
  return new Promise<Server>((resolve, reject) => {
    if (esx !== null) {
      resolve(esx);
    }
    let timeout: NodeJS.Timeout;
    const interval = setInterval(() => {
      if (esx !== null) {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(esx);
      }
    }, 100);
    timeout = setTimeout(() => {
      if (esx === null) {
        clearTimeout(timeout);
        clearInterval(interval);
        reject();
      }
    }, 5000);
  });
};

on('onServerResourceStart', (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    mainLogger.info('Sucessfully started');
  }
});
