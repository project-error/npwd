import { createDbTable, DATABASE_PREFIX } from '../utils';
import { DBInstance } from '../knex';
import { Contact } from '../../../shared/Types';

export type InsertContact = Pick<Contact, 'name' | 'phone_number' | 'sim_card_id'>;

export const createContactsTable = () => {
  createDbTable('contact', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('phone_number').notNullable();
    table.integer('sim_card_id').unsigned().references('id').inTable(`${DATABASE_PREFIX}sim_card`);
    table.dateTime('created_at').notNullable().defaultTo(DBInstance.fn.now());

    table.unique(['phone_number', 'sim_card_id']);
  });
};
