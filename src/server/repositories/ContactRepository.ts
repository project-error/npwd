import { Contact } from '../../shared/Types';
import { DBInstance } from '../database/knex';
import { InsertContact } from '../database/schemas/Contact';

const tableName = 'tmp_phone_contact';

class ContactRepository {
  public async getContacts(): Promise<Contact[]> {
    return await DBInstance(tableName);
  }

  public async getContactById(contactId: number): Promise<Contact | null> {
    return await DBInstance(tableName).where('id', contactId).first();
  }

  public async getContactsBySid(sid: number): Promise<Contact[]> {
    return await DBInstance(tableName).where('sim_card_id', sid).orderBy('created_at', 'desc');
  }

  public async createContact(contact: InsertContact): Promise<Contact> {
    const [newId] = await DBInstance(tableName).insert(contact);
    return await DBInstance(tableName).select('*').where('id', newId).first();
  }

  public async updateContact(contact: Contact): Promise<Contact> {
    await DBInstance(tableName).where('id', contact.id).update(contact);
    return await this.getContactById(contact.id);
  }

  public async deleteContact(contactId: number): Promise<void> {
    await DBInstance(tableName).where('id', contactId).delete();
  }
}

export default new ContactRepository();
