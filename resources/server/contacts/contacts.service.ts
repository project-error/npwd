import PlayerService from '../players/player.service';
import { contactsLogger } from './contacts.utils';
import ContactsDB, { _ContactsDB } from './contacts.db';
import { Contact, ContactDeleteDTO, ContactResp, PreDBContact } from '../../../typings/contact';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { checkAndFilterImage } from './../utils/imageFiltering';

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
    const number = await PlayerService.getPhoneNumberFromIdentifier(identifier);
    try {
      const imageUrl = checkAndFilterImage(reqObj.data.avatar);
      if (imageUrl == null) {
        return resp({ status: 'error', errorMsg: 'GENERIC_INVALID_IMAGE_HOST' });
      }
      reqObj.data.avatar = imageUrl;
      await this.contactsDB.updateContact(reqObj.data, number);
      resp({ status: 'ok' });
    } catch (e) {
      contactsLogger.error(`Error in handleUpdateContact (${identifier}), ${e.message}`);
      resp({ status: 'error', errorMsg: ContactResp.UPDATE_FAILED });
    }
  }
  async handleDeleteContact(
    reqObj: PromiseRequest<ContactDeleteDTO>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const number = await PlayerService.getPhoneNumberFromIdentifier(identifier);
    try {
      await this.contactsDB.deleteContact(reqObj.data.id, number);
      resp({ status: 'ok' });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
      contactsLogger.error(`Error in handleDeleteContact (${number}), ${e.message}`);
    }
  }
  async handleAddContact(
    reqObj: PromiseRequest<PreDBContact>,
    resp: PromiseEventResp<Contact>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const number = await PlayerService.getPhoneNumberFromIdentifier(identifier);
    try {
      const imageUrl = checkAndFilterImage(reqObj.data.avatar);
      if (imageUrl == null) {
        return resp({ status: 'error', errorMsg: 'GENERIC_INVALID_IMAGE_HOST' });
      }
      reqObj.data.avatar = imageUrl;
      const contact = await this.contactsDB.addContact(number, reqObj.data);

      resp({ status: 'ok', data: contact });
    } catch (e) {
      contactsLogger.error(`Error in handleAddContact, ${e.message}`);
      resp({ status: 'error', errorMsg: ContactResp.ADD_FAILED });
    }
  }
  async handleFetchContacts(
    reqObj: PromiseRequest,
    resp: PromiseEventResp<Contact[]>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    const number = await PlayerService.getPhoneNumberFromIdentifier(identifier);
    try {
      const contacts = await this.contactsDB.fetchAllContacts(number);
      resp({ status: 'ok', data: contacts });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
      contactsLogger.error(`Error in handleFetchContact (${number}), ${e.message}`);
    }
  }
}

const ContactService = new _ContactService();
export default ContactService;
