import { Server } from "esx.js";

import "./db";
import "./sv_twitter";
import "./sv_main";
import "./sv_contacts";
import "./sv_sellout";
import "./sv_bank";
import "./sv_notes";
import "./sv_photo";
import "./sv_messages";

export let ESX: Server = null;

export const getSource = () => (global as any).source;

emit("esx:getSharedObject", (obj: Server) => (ESX = obj));

// i llke t-notify
