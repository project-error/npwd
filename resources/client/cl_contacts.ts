import { ESX } from '../client/client';
import events from '../utils/events';

onNet(events.CONTACTS_SEND_CONTACTS, () => {
  ESX.TriggerServerCallback(events.CONTACTS_GET_CONTACTS, (contacts: any) => {
    SendNuiMessage(
      JSON.stringify({
        app: 'CONTACTS',
        method: 'setContacts',
        data: contacts
      })
    )
  })
});

RegisterNuiCallbackType(events.CONTACTS_ADD_CONTACT_NUI);
on(`__cfx_nui:${events.CONTACTS_ADD_CONTACT_NUI}`, (data: any) => {
  const display = data.name;
  const number = data.number;
  emitNet(events.CONTACTS_ADD_CONTACT, display, number);
});
