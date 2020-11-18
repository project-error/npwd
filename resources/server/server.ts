import { ESXServer } from "fivem-esx-js/server/esx_server";

import './db';
import './sv_twitter';
import './sv_main';
import './sv_contacts';
import './sv_sellout';
import './sv_bank';

export let ESX: ESXServer = null;

emit("esx:getSharedObject", (obj: ESXServer) => (ESX = obj));

