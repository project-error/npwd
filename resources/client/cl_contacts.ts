import events from '../utils/events';
import { ContactNetEvents } from '../../phone/src/common/typings/contact';

onNet(events.CONTACTS_SEND_CONTACTS, (contacts: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'CONTACTS',
      method: 'setContacts',
      data: contacts,
    }),
  );
});

RegisterNuiCallbackType(ContactNetEvents.ADD_CONTACT);
on(`__cfx_nui:${ContactNetEvents.ADD_CONTACT}`, (data: any, cb: Function) => {
  emitNet(ContactNetEvents.ADD_CONTACT, data.number, data.display, data.avatar);
  cb();
});

onNet(ContactNetEvents.ADD_CONTACT_SUCCESS, () => {
  emitNet(ContactNetEvents.GET_CONTACTS);
});

RegisterNuiCallbackType(ContactNetEvents.UPDATE_CONTACT);
on(`__cfx_nui:${ContactNetEvents.UPDATE_CONTACT}`, (data: any, cb: Function) => {
  emitNet(ContactNetEvents.UPDATE_CONTACT, data);
  cb();
});

onNet(ContactNetEvents.UPDATE_CONTACT_SUCCESS, () => {
  emitNet(ContactNetEvents.GET_CONTACTS);
});

RegisterNuiCallbackType(ContactNetEvents.DELETE_CONTACT);
on(`__cfx_nui:${ContactNetEvents.DELETE_CONTACT}`, (data: any, cb: Function) => {
  emitNet(ContactNetEvents.DELETE_CONTACT, data);
  cb();
});

onNet(ContactNetEvents.DELETE_CONTACT_SUCCESS, () => {
  emitNet(ContactNetEvents.GET_CONTACTS);
});

onNet(ContactNetEvents.ACTION_RESULT, (alert: any) => {
  SendNuiMessage(
    JSON.stringify({
      app: 'CONTACTS',
      method: 'setAlert',
      data: alert,
    }),
  );
});
