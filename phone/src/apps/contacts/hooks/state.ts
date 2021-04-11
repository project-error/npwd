import { atom } from 'recoil';
import { Contact } from '../../../../../typings/contact';

export const contactsState = {
  contacts: atom<Contact[]>({
    key: 'contactsList',
    default: [],
  }),
  showModal: atom<boolean>({
    key: 'showModal',
    default: false,
  }),
  filterContacts: atom<string>({
    key: 'filterContacts',
    default: '',
  }),
};
