import { Contact, PreDBContact } from '../../../typings/contact';
import { ResultSetHeader } from 'mysql2';
import DbInterface from '../db/db_wrapper';

export class _ContactsDB {
  async fetchAllContacts(phone_number: string): Promise<Contact[]> {
    const query = 'SELECT * FROM npwd_phone_contacts WHERE phone_number = ? ORDER BY display ASC';
    const [results] = await DbInterface._rawExec(query, [phone_number]);
    return <Contact[]>results;
  }

  async addContact(
    phone_number: string,
    { display, avatar, number }: PreDBContact,
  ): Promise<Contact> {
    const query =
      'INSERT INTO npwd_phone_contacts (phone_number, number, display, avatar) VALUES (?, ?, ?, ?)';

    const [setResult] = await DbInterface._rawExec(query, [phone_number, number, display, avatar]);

    return {
      id: (<ResultSetHeader>setResult).insertId,
      number,
      avatar,
      display,
    };
  }

  async updateContact(contact: Contact, phone_number: string): Promise<any> {
    const query =
      'UPDATE npwd_phone_contacts SET number = ?, display = ?, avatar = ? WHERE id = ? AND phone_number = ?';
    await DbInterface._rawExec(query, [
      contact.number,
      contact.display,
      contact.avatar,
      contact.id,
      phone_number,
    ]);
  }

  async deleteContact(contactId: number, phone_number: string): Promise<void> {
    const query = 'DELETE FROM npwd_phone_contacts WHERE id = ? AND phone_number = ?';
    await DbInterface._rawExec(query, [contactId, phone_number]);
  }
}

const ContactsDB = new _ContactsDB();
export default ContactsDB;
