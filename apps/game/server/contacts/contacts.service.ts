import PlayerService from '../players/player.service';
import { contactsLogger } from './contacts.utils';
import { Contact, ContactDeleteDTO, ContactResp, PreDBContact } from '@typings/contact';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { checkAndFilterImage } from './../utils/imageFiltering';
import { _ContactsDB, ContactsDB } from './contacts.database';
import { distanceBetweenCoords } from "../utils/miscUtils";
import { generateProfileName } from "../utils/generateProfileName";

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
    try {
      const imageUrl = checkAndFilterImage(reqObj.data.avatar);
      if (imageUrl == null) {
        return resp({ status: 'error', errorMsg: 'GENERIC_INVALID_IMAGE_HOST' });
      }
      reqObj.data.avatar = imageUrl;
      await this.contactsDB.updateContact(reqObj.data, identifier);
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
    try {
      await this.contactsDB.deleteContact(reqObj.data.id, identifier);
      resp({ status: 'ok' });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
      contactsLogger.error(`Error in handleDeleteContact (${identifier}), ${e.message}`);
    }
  }
  async handleAddContact(
    reqObj: PromiseRequest<PreDBContact>,
    resp: PromiseEventResp<Contact>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      const imageUrl = checkAndFilterImage(reqObj.data.avatar);
      if (imageUrl == null) {
        return resp({ status: 'error', errorMsg: 'GENERIC_INVALID_IMAGE_HOST' });
      }
      reqObj.data.avatar = imageUrl;
      const contact = await this.contactsDB.addContact(identifier, reqObj.data);

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
    try {
      const contacts = await this.contactsDB.fetchAllContacts(identifier);
      resp({ status: 'ok', data: contacts });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
      contactsLogger.error(`Error in handleFetchContact (${identifier}), ${e.message}`);
    }
  }

  async handleLocalShare(
    reqObj: PromiseRequest,
    resp: PromiseEventResp<void>
  ): Promise<void> {
    const source = reqObj.source.toString()
    const sourceCoords = GetEntityCoords(GetPlayerPed(source))

    const player = PlayerService.getPlayer(reqObj.source)
    const name = player.getName()
    const number = player.getPhoneNumber()

    getPlayers()?.forEach(src => {
      if (src === source) return;

      const dist = distanceBetweenCoords(sourceCoords, GetEntityCoords(GetPlayerPed(src)))
      if (dist <=3 ){
        emitNet('npwd:contacts:receiveContact', src, {name, number})
      }
    })

    resp({status: "ok"})
  }
}

const ContactService = new _ContactService();
export default ContactService;
