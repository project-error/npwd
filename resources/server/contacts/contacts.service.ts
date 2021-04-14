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
      this.responseBuilder(src, {
        action: ContactEvents.UPDATE_CONTACT,
      });
    } catch (e) {
      contactsLogger.error(`Error in handleUpdateContact (${identifier}), ${e.message}`);
      this.responseBuilder(src, {
        action: ContactEvents.UPDATE_CONTACT,
        error: {
          errorKey: ErrorStringKeys.UPDATE_FAILED,
          message: `Failed to update contact ${contact.id}`,
        },
      });
    }
  }
  async handleDeleteContact(src: number, contactId: number): Promise<void> {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.contactsDB.deleteContact(contactId, identifier);
      this.responseBuilder(src, {
        action: ContactEvents.DELETE_CONTACT,
      });
    } catch (e) {
      this.responseBuilder(src, {
        action: ContactEvents.DELETE_CONTACT,
        error: {
          errorKey: ErrorStringKeys.DELETE_FAILED,
          message: `Failed to delete contactId ${contactId}`,
        },
      });
      contactsLogger.error(`Error in handleDeleteContact (${identifier}), ${e.message}`);
    }
  }
  async handleAddContact(src: number, contact: PreDBContact): Promise<void> {
    const identifier = PlayerService.getIdentifier(src);
    try {
      await this.contactsDB.addContact(identifier, contact);

      this.responseBuilder(src, {
        action: ContactEvents.ADD_CONTACT,
      });
    } catch (e) {
      contactsLogger.error(`Error in handleAddContact, ${e.message}`);
      this.responseBuilder(src, {
        action: ContactEvents.ADD_CONTACT,
        error: {
          errorKey: ErrorStringKeys.ADD_FAILED,
          message: 'Unable to add contacts',
        },
      });
    }
  }
  async handleFetchContact(src: number, limit?: number): Promise<void> {
    const identifier = PlayerService.getIdentifier(src);

    try {
      const contacts = await this.contactsDB.fetchAllContacts(identifier, limit);

      this.responseBuilder(src, {
        data: contacts,
        action: ContactEvents.SEND_CONTACTS,
      });
    } catch (e) {
      this.responseBuilder(src, {
        action: ContactEvents.SEND_CONTACTS,
        error: {
          errorKey: ErrorStringKeys.SERVER_ERROR,
          message: 'Unable to fetch contacts',
        },
      });
      contactsLogger.error(`Error in handleFetchContact (${identifier}), ${e.message}`);
    }
  }
}

const ContactService = new _ContactService();
export default ContactService;
