import { Contact, ContactEvents, PreDBContact } from '../../../typings/contact';
import { getSource } from '../utils/miscUtils';
import ContactService from './contacts.service';
import { contactsLogger } from './contacts.utils';

onNet(ContactEvents.GET_CONTACTS, async (limit: number) => {
  const src = getSource();
  ContactService.handleFetchContact(src, limit).catch((e) =>
    contactsLogger.error(`Error occured in fetch contacts event (${src}), Error:  ${e.message}`),
  );
});

onNet(ContactEvents.ADD_CONTACT, async (contact: PreDBContact) => {
  const src = getSource();
  ContactService.handleAddContact(src, contact).catch((e) =>
    contactsLogger.error(`Error occured in fetch contacts event (${src}), Error:  ${e.message}`),
  );
});

onNet(ContactEvents.UPDATE_CONTACT, async (contact: Contact) => {
  const src = getSource();
  ContactService.handleUpdateContact(src, contact).catch((e) =>
    contactsLogger.error(`Error occured in update contact event (${src}), Error:  ${e.message}`),
  );
});

onNet(ContactEvents.DELETE_CONTACT, async (contactId: number) => {
  const src = getSource();
  ContactService.handleDeleteContact(src, contactId).catch((e) =>
    contactsLogger.error(`Error occured in delete contact event (${src}), Error:  ${e.message}`),
  );
});
