import { pool } from '../db';
import { Contact, PreDBContact } from '../../../typings/contact';
import { FetchDefaultLimits } from '../utils/ServerConstants';

export class _ContactsDB {
  async fetchAllContacts(
    identifier: string,
    limit = FetchDefaultLimits.CONTACTS_FETCH_LIMIT,
  ): Promise<Contact[]> {
    const query =
      'SELECT * FROM npwd_phone_contacts WHERE identifier = ? ORDER BY display ASC LIMIT ?';
    const [results] = await pool.query(query, [identifier, limit]);
    return <Contact[]>results;
  }

  async addContact(identifier: string, { display, avatar, number }: PreDBContact): Promise<void> {
    const query =
      'INSERT INTO npwd_phone_contacts (identifier, number, display, avatar) VALUES (?, ?, ?, ?)';

    await pool.query(query, [identifier, number, display, avatar]);
  }

  async updateContact(contact: Contact, identifier: string): Promise<any> {
    const query =
      'UPDATE npwd_phone_contacts SET number = ?, display = ?, avatar = ? WHERE id = ? AND identifier = ?';
    await pool.query(query, [
      contact.number,
      contact.display,
      contact.avatar,
      contact.id,
      identifier,
    ]);
  }

  async deleteContact(contactId: number, identifier: string): Promise<void> {
    const query = 'DELETE FROM npwd_phone_contacts WHERE id = ? AND identifier = ?';
    await pool.query(query, [contactId, identifier]);
  }
}

const ContactsDB = new _ContactsDB();
export default ContactsDB;
