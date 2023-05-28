import { ContactEvents } from '@typings/contact';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(ContactEvents.PAY_CONTACT);
RegisterNuiProxy(ContactEvents.GET_CONTACTS);
RegisterNuiProxy(ContactEvents.ADD_CONTACT);
RegisterNuiProxy(ContactEvents.DELETE_CONTACT);
RegisterNuiProxy(ContactEvents.UPDATE_CONTACT);
