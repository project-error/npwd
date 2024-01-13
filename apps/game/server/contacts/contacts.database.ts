import { Contact, PreDBContact } from '@typings/contact';
import { ResultSetHeader } from 'mysql2';
import { DbInterface } from '@npwd/database';
import { config } from '@npwd/config/server';

export class _ContactsDB {
  private readonly defaultContacts: Contact[] = config.defaultContacts.map((contact) => ({
    id: `${contact.display}:${contact.number}`,
    ...contact,
  }));

  async fetchAllContacts(identifier: string): Promise<Contact[]> {
    const query = 'SELECT * FROM npwd_phone_contacts WHERE identifier = ? ORDER BY display ASC';
    const [results] = await DbInterface._rawExec(query, [identifier]);

    return this.defaultContacts.concat(<Contact[]>results);
  }

  async addContact(
    identifier: string,
    { display, avatar, number }: PreDBContact,
  ): Promise<Contact> {
    const query =
      'INSERT INTO npwd_phone_contacts (identifier, number, display, avatar) VALUES (?, ?, ?, ?)';

    const [setResult] = await DbInterface._rawExec(query, [identifier, number, display, avatar]);

    return {
      id: (<ResultSetHeader>setResult).insertId,
      number,
      avatar,
      display,
    };
  }

  async updateContact(contact: Contact, identifier: string): Promise<any> {
    const query =
      'UPDATE npwd_phone_contacts SET number = ?, display = ?, avatar = ? WHERE id = ? AND identifier = ?';
    await DbInterface._rawExec(query, [
      contact.number,
      contact.display,
      contact.avatar,
      contact.id,
      identifier,
    ]);
  }

  async deleteContact(contactId: number, identifier: string): Promise<void> {
    const query = 'DELETE FROM npwd_phone_contacts WHERE id = ? AND identifier = ?';
    await DbInterface._rawExec(query, [contactId, identifier]);
  }
}

export const ContactsDB = new _ContactsDB();
