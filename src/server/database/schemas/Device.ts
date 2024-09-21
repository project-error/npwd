import { Device, SimCard } from '../../../shared/Types';
import { DBInstance } from '../knex';
import { createDbTable, DATABASE_PREFIX } from '../utils';

export interface DeviceWithSimCard extends Device, SimCard {}

export type InsertDevice = Pick<Device, 'sim_card_id' | 'identifier'>;

export const createDevicesTable = async () => {
  await createDbTable('device', (table) => {
    table.increments('id').primary();
    // Generate random string for the identifier
    table.string('identifier').notNullable().unique().defaultTo(DBInstance.fn.uuid());
    table.integer('sim_card_id').unsigned().references('id').inTable(`${DATABASE_PREFIX}sim_card`);
    table.jsonb('settings').nullable();
    table.dateTime('created_at').notNullable().defaultTo(DBInstance.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(DBInstance.fn.now());
  });
};
