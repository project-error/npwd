import {ESXClient} from "fivem-esx-js/client/esx_client";

let ESX: ESXClient = null;

setTick(() => {
  while (ESX === null) {
    emit('esx:getSharedObject', (obj: ESXClient) => ESX = obj);
  }
});