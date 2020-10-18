import { ESX } from "../client/client";
import events from "../utils/events";

onNet(events.CONTACTS_SEND_CONTACTS, (contacts: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: "CONTACTS",
      method: "setContacts",
      data: contacts,
    })
  );
});

RegisterNuiCallbackType(events.CONTACTS_ADD_CONTACT);
on(`__cfx_nui:${events.CONTACTS_ADD_CONTACT}`, (data: any) => {
  const display = data.name;
  const number = data.number;
  const avatar = data.avatar;
  emitNet(events.CONTACTS_ADD_CONTACT, number, display, avatar);

  setTimeout(() => {
    emitNet(events.CONTACTS_GET_CONTACTS)
  }, 500)
});

