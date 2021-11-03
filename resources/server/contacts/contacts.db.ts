import { Contact, PreDBContact } from '../../../typings/contact';
import { ResultSetHeader } from 'mysql2';
import DbInterface from '../db/db_wrapper';

export class _ContactsDB {
  async fetchAllContacts(identifier: string, phoneNumber: string): Promise<Contact[]> {
    const query =
      'SELECT * FROM npwd_phone_contacts WHERE identifier = ? AND user_number = ? ORDER BY display ASC';
    const [results] = await DbInterface._rawExec(query, [identifier, phoneNumber]);
    return <Contact[]>results;
  }

  async addContact(
    identifier: string,
    user_number: string,
    { display, avatar, number }: PreDBContact,
  ): Promise<Contact> {
    const query =
      'INSERT INTO npwd_phone_contacts (identifier, user_number, number, display, avatar) VALUES (?, ?, ?, ?, ?)';
    const [setResult] = await DbInterface._rawExec(query, [
      identifier,
      user_number,
      number,
      display,
      avatar,
    ]);
    return {
      id: (<ResultSetHeader>setResult).insertId,
      number,
      avatar,
      display,
    };
  }

  async updateContact(contact: Contact, identifier: string, phoneNumber: string): Promise<any> {
    const query =
      'UPDATE npwd_phone_contacts SET number = ?, display = ?, avatar = ? WHERE id = ? AND identifier = ? AND user_number = ?';
    await DbInterface._rawExec(query, [
      contact.number,
      contact.display,
      contact.avatar,
      contact.id,
      identifier,
      phoneNumber,
    ]);
  }

  async deleteContact(contactId: number, identifier: string, phoneNumber: string): Promise<void> {
    const query =
      'DELETE FROM npwd_phone_contacts WHERE id = ? AND identifier = ? AND user_number = ?';
    await DbInterface._rawExec(query, [contactId, identifier, phoneNumber]);
  }
}

const ContactsDB = new _ContactsDB();
export default ContactsDB;
