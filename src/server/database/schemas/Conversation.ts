import { createDbTable } from '../utils';

export const createConversationTable = () => {
  createDbTable('conversation', (table) => {
    table.increments('id').primary();
    table.string('label').notNullable();
    // table.json('messages').notNullable(); // Assuming messages are stored as JSON array of message IDs
    // table.json('participants').notNullable(); // Assuming participants are stored as JSON array of simcard IDs
  });
};
