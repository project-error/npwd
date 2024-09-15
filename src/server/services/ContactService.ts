import { RouterContext } from 'fivem-router';
import ContactRepository from '../repositories/ContactRepository';
import DeviceRepository from '../repositories/DeviceRepository';
import {
  ContactAlreadyExistsError,
  ContactNotFoundError,
  UnauthorizedError,
} from '../../shared/Errors';
import { Contact } from '../../shared/Types';

class ContactService {
  private readonly contactRepository: typeof ContactRepository;
  private readonly deviceRepository: typeof DeviceRepository;

  constructor(
    contactRepository: typeof ContactRepository,
    deviceRepository: typeof DeviceRepository,
  ) {
    this.contactRepository = contactRepository;
    this.deviceRepository = deviceRepository;
  }

  public async addContact(
    { device }: RouterContext,
    name: string,
    phoneNumber: string,
  ): Promise<Contact> {
    try {
      const contact = await this.contactRepository.createContact({
        name,
        phone_number: phoneNumber,
        sim_card_id: device.sim_card_id,
      });
      return contact;
    } catch (error) {
      /** Check duplicate */
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ContactAlreadyExistsError();
      }

      throw error;
    }
  }

  public async getContacts(ctx: RouterContext): Promise<Contact[]> {
    return await this.contactRepository.getContactsBySid(ctx.device.sim_card_id);
  }

  public async getContactById(ctx: RouterContext, contactId: number): Promise<Contact | null> {
    const contact = await this.contactRepository.getContactById(contactId);

    if (!contact) {
      throw new ContactNotFoundError();
    }

    if (contact.sim_card_id !== ctx.device.sim_card_id) {
      throw new UnauthorizedError();
    }

    return contact;
  }

  public async updateContact(
    ctx: RouterContext,
    contactId: number,
    name: string,
    phoneNumber: string,
  ): Promise<Contact> {
    const contact = await this.getContactById(ctx, contactId);

    if (!contact) {
      throw new ContactNotFoundError();
    }

    if (contact.sim_card_id !== ctx.device.id) {
      throw new UnauthorizedError();
    }

    contact.name = name;
    contact.phone_number = phoneNumber;
    return await this.contactRepository.updateContact(contact);
  }

  public async deleteContact(ctx: RouterContext, contactId: number): Promise<void> {
    const contact = await this.getContactById(ctx, contactId);

    if (!contact) {
      throw new ContactNotFoundError();
    }

    if (contact.sim_card_id !== ctx.device.sim_card_id) {
      throw new UnauthorizedError();
    }

    await this.contactRepository.deleteContact(contactId);
  }
}

export default new ContactService(ContactRepository, DeviceRepository);
