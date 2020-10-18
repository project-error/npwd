import  { pool } from './db';
import { ESX, getSource } from './server';

export const usePhoneNumber = async (identifier: string) => {
  const query = "SELECT phone_number FROM users WHERE identifier = ?"
  const result = await pool.query(query, [identifier]);

  return result
}