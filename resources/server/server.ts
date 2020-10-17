import { ESXServer } from "fivem-esx-js/server/esx_server";

import "./db";
import "./sv_twitter";
import "./sv_main";
import "./sv_contacts";

export let ESX: ESXServer = null;

emit("esx:getSharedObject", (obj: ESXServer) => (ESX = obj));

export const getSource = () => parseInt(source);
