import { Contact, PreDBContact } from '@typings/contact';
import { ResultSetHeader } from 'mysql2';
import DbInterface from '../db/db_wrapper';
import { NPWDDataSource } from '../db/data-source';
import { Repository } from 'typeorm';
import { Contact as ContactEntity } from '../entity/Contact';

export class _ContactDataSource extends NPWDDataSource {
  private readonly contactRepository: Repository<ContactEntity>;

  constructor() {
    super();

    this.contactRepository = this.dataSource.getRepository(ContactEntity);
  }

  async fetchAllContacts(identifier: string) {
    const contacts = await this.contactRepository.find({
      where: { identifier },
      order: { display: 'ASC' },
    });
    return contacts;
  }

  async addContact(
    identifier: string,
    { display, avatar, number }: PreDBContact,
  ): Promise<ContactEntity> {
    const contact = await this.contactRepository.save({
      identifier,
      display,
      avatar,
      number,
    });

    return contact;
  }

  async updateContact(contact: Contact, identifier: string): Promise<void> {
    await this.contactRepository.update(
      { id: contact.id, identifier },
      {
        display: contact.display,
        avatar: contact.avatar,
        number: contact.number,
      },
    );
  }

  async deleteContact(contact: Contact, identifier: string): Promise<void> {
    await this.contactRepository.delete({ id: contact.id, identifier });
  }
}

const ContactsDB = new _ContactDataSource();
export default ContactsDB;
