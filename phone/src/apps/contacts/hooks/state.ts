import { atom } from 'recoil';

export const contactsState = {
  contacts: atom({
    key: 'contactsList',
    default: [],
  }),
  showModal: atom({
    key: 'showModal',
    default: false,
  }),
  filterContacts: atom({
    key: 'filterContacts',
    default: '',
  }),
  showContactsModal: atom({
    key: 'showContactModal',
    default: false,
  }),
  contactDetail: atom({
    key: 'contactDetail',
    default: null,
  }),
};
