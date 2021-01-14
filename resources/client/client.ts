import { Client } from 'esx.js';

import './cl_main';
import './cl_twitter';
import './cl_contacts';
import './cl_sellout';
import './cl_bank';
import './cl_notes';
import './cl_photo';
import './cl_messages';

export let ESX: Client = null;

setTick(() => {
  while (ESX === null) {
    emit('esx:getSharedObject', (obj: Client) => (ESX = obj));
  }
});
