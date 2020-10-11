import { ESXServer } from "fivem-esx-js/server/esx_server";

import './db';
import './sv_twitter';

let ESX: ESXServer = null;

emit('esx:getSharedObject', (obj: ESXServer) => ESX = obj);