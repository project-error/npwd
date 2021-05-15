import PlayerService from '../players/player.service';
import { contactsLogger } from './contacts.utils';
import ContactsDB, { _ContactsDB } from './contacts.db';
import { Contact, ContactEvents, PreDBContact } from '../../../typings/contact';
import { ErrorStringKeys, FxServerResponse } from '../../../typings/phone';
import { ContactServerResp } from './contacts.interfaces';

class _ContactService {
  private readonly contactsDB: _ContactsDB;

  constructor() {
    this.contactsDB = ContactsDB;
    contactsLogger.debug('Contacts service started');
  }

  private responseBuilder(src: number, { data, action, error }: ContactServerResp): void {
    const serverRespObj: FxServerResponse = {
      app: 'CONTACTS',
      error,
      status: data ? 'success' : 'failure',
      action,
    };

    emitNet(ContactEvents.MAIN_CLIENT_LISTER, src, serverRespObj);
  }

  async handleUpdateContact(src: number, contact: Contact): Promise<void> {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.contactsDB.updateContact(contact, identifier);

      emitNet(ContactEvents.UPDATE_CONTACT_SUCCESS, src);

      emitNet(ContactEvents.ACTION_RESULT, src, {
        message: 'CONTACT_UPDATE_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      contactsLogger.error(`Error in handleUpdateContact (${identifier}), ${e.message}`);
      emitNet(ContactEvents.ACTION_RESULT, src, {
        message: 'CONTACT_UPDATE_FAILED',
        type: 'error',
      });
    }
  }
  async handleDeleteContact(src: number, contactId: number): Promise<void> {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.contactsDB.deleteContact(contactId, identifier);
      emitNet(ContactEvents.DELETE_CONTACT_SUCCESS, src);
      emitNet(ContactEvents.ACTION_RESULT, src, {
        message: 'CONTACT_DELETE_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      emitNet(ContactEvents.ACTION_RESULT, src, {
        message: 'CONTACT_DELETE_FAILED',
        type: 'error',
      });
      contactsLogger.error(`Error in handleDeleteContact (${identifier}), ${e.message}`);
    }
  }
  async handleAddContact(src: number, contact: PreDBContact): Promise<void> {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.contactsDB.addContact(identifier, contact);

      emitNet(ContactEvents.ADD_CONTACT_SUCCESS, src);
      emitNet(ContactEvents.ACTION_RESULT, src, {
        message: 'CONTACT_ADD_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      contactsLogger.error(`Error in handleAddContact, ${e.message}`);
      emitNet(ContactEvents.ACTION_RESULT, src, {
        message: 'CONTACT_ADD_FAILED',
        type: 'error',
      });
    }
  }
  async handleFetchContact(src: number, limit?: number): Promise<void> {
    const identifier = PlayerService.getIdentifier(src);

    try {
      const contacts = await this.contactsDB.fetchAllContacts(identifier, limit);

      emitNet(ContactEvents.SEND_CONTACTS, src, contacts);
    } catch (e) {
      contactsLogger.error(`Error in handleFetchContact (${identifier}), ${e.message}`);
    }
  }
}

const ContactService = new _ContactService();
export default ContactService;
