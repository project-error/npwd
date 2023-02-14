import { Contact, PLAYER_IDENITIFER } from '../database/data-source';

export class ContactService {
  async getContacts(): Promise<Contact[]> {
    const contacts = await Contact.findAll();
    if (!contacts || contacts.length == 0) return null;

    return contacts;
  }

  async addContact(contact: Contact): Promise<Contact> {
    console.log('CONTACT', contact);

    try {
      const newContact = await Contact.create({
        display: contact.display,
        number: contact.number,
        avatar: contact.avatar,
        identifier: PLAYER_IDENITIFER,
      });
      return newContact;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
