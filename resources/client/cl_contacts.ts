import { ContactEvents } from '../../typings/contact';
import { sendContactsEvent } from '../utils/messages';

onNet(ContactEvents.SEND_CONTACTS, (contacts: any) => {
  sendContactsEvent(ContactEvents.SEND_CONTACTS, contacts);
});

RegisterNuiCallbackType(ContactEvents.ADD_CONTACT);
on(`__cfx_nui:${ContactEvents.ADD_CONTACT}`, (data: any, cb: Function) => {
  emitNet(ContactEvents.ADD_CONTACT, data.number, data.display, data.avatar);
  cb();
});

onNet(ContactEvents.ADD_CONTACT_SUCCESS, () => {
  emitNet(ContactEvents.GET_CONTACTS);
});

RegisterNuiCallbackType(ContactEvents.UPDATE_CONTACT);
on(`__cfx_nui:${ContactEvents.UPDATE_CONTACT}`, (data: any, cb: Function) => {
  emitNet(ContactEvents.UPDATE_CONTACT, data);
  cb();
});

onNet(ContactEvents.UPDATE_CONTACT_SUCCESS, () => {
  emitNet(ContactEvents.GET_CONTACTS);
});

RegisterNuiCallbackType(ContactEvents.DELETE_CONTACT);
on(`__cfx_nui:${ContactEvents.DELETE_CONTACT}`, (data: any, cb: Function) => {
  emitNet(ContactEvents.DELETE_CONTACT, data);
  cb();
});

onNet(ContactEvents.DELETE_CONTACT_SUCCESS, () => {
  emitNet(ContactEvents.GET_CONTACTS);
});

onNet(ContactEvents.ACTION_RESULT, (alert: any) => {
  sendContactsEvent(ContactEvents.SEND_ALERT, alert);
});
