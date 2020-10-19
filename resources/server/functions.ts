import  { pool } from './db';

export const usePhoneNumber = async (identifier: string) => {
  const query = "SELECT phone_number FROM users WHERE identifier = ?"
  const phoneNumber = await pool.query(query, [identifier]);
  return phoneNumber;
}