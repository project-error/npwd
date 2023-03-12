import { ContactsDB, _ContactsDB } from '@npwd/database';
import { Contact } from '@typings/contact';
import { PLAYER_IDENITIFER } from '../database/data-source';

export class ContactService {
  private readonly _contactDB: _ContactsDB;

  constructor() {
    this._contactDB = ContactsDB;
  }

  async getContacts(): Promise<Contact[]> {
    const contacts = await this._contactDB.fetchAllContacts(PLAYER_IDENITIFER);
    if (!contacts || contacts.length == 0) return null;

    return contacts;
  }

  async addContact(contact: Contact): Promise<Contact> {
    console.log('CONTACT', contact);

    try {
      const newContact = await this._contactDB.addContact(PLAYER_IDENITIFER, contact);
      return newContact;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
