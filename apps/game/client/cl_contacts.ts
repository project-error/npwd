import { ContactEvents } from '@typings/contact';
import { RegisterNuiProxy } from './cl_utils';
import { sendContactsEvent } from "../utils/messages";

RegisterNuiProxy(ContactEvents.PAY_CONTACT);
RegisterNuiProxy(ContactEvents.GET_CONTACTS);
RegisterNuiProxy(ContactEvents.ADD_CONTACT);
RegisterNuiProxy(ContactEvents.DELETE_CONTACT);
RegisterNuiProxy(ContactEvents.UPDATE_CONTACT);
RegisterNuiProxy(ContactEvents.LOCAL_SHARE)

const exp = global.exports

onNet("npwd:contacts:receiveContact", (data: unknown) => {
  sendContactsEvent(ContactEvents.ADD_CONTACT_EXPORT, data);
})