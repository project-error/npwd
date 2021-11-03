import PlayerService from '../players/player.service';
import { contactsLogger } from './contacts.utils';
import ContactsDB, { _ContactsDB } from './contacts.db';
import { Contact, ContactDeleteDTO, PreDBContact } from '../../../typings/contact';
import { PromiseEventResp, PromiseRequest } from '../utils/PromiseNetEvents/promise.types';

class _ContactService {
  private readonly contactsDB: _ContactsDB;

  constructor() {
    this.contactsDB = ContactsDB;
    contactsLogger.debug('Contacts service started');
  }

  async handleUpdateContact(
    reqObj: PromiseRequest<Contact>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const player = PlayerService.getPlayer(reqObj.source);
    const srcPlayerNumber = player.getPhoneNumber();
    try {
      await this.contactsDB.updateContact(reqObj.data, identifier, srcPlayerNumber);
      resp({ status: 'ok' });
    } catch (e) {
      contactsLogger.error(`Error in handleUpdateContact (${identifier}), ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }
  async handleDeleteContact(
    reqObj: PromiseRequest<ContactDeleteDTO>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const player = PlayerService.getPlayer(reqObj.source);
    const srcPlayerNumber = player.getPhoneNumber();
    try {
      await this.contactsDB.deleteContact(reqObj.data.id, identifier, srcPlayerNumber);
      resp({ status: 'ok' });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      contactsLogger.error(`Error in handleDeleteContact (${identifier}), ${e.message}`);
    }
  }
  async handleAddContact(
    reqObj: PromiseRequest<PreDBContact>,
    resp: PromiseEventResp<Contact>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const player = PlayerService.getPlayer(reqObj.source);
    const srcPlayerNumber = player.getPhoneNumber();
    try {
      const contact = await this.contactsDB.addContact(identifier, srcPlayerNumber, reqObj.data);

      resp({ status: 'ok', data: contact });
    } catch (e) {
      contactsLogger.error(`Error in handleAddContact, ${e.message}`);
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
    }
  }
  async handleFetchContacts(
    reqObj: PromiseRequest,
    resp: PromiseEventResp<Contact[]>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const player = PlayerService.getPlayer(reqObj.source);
    const srcPlayerNumber = player.getPhoneNumber();
    try {
      const contacts = await this.contactsDB.fetchAllContacts(identifier, srcPlayerNumber);
      resp({ status: 'ok', data: contacts });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      contactsLogger.error(`Error in handleFetchContact (${identifier}), ${e.message}`);
    }
  }
}

const ContactService = new _ContactService();
export default ContactService;
