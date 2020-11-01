import  { pool } from './db';
import { ESX, getSource } from './server';

interface IPhoneNumber {
  phone_number: string;
}

export async function usePhoneNumber(identifier: string): Promise<string> {
  const query = "SELECT phone_number FROM users WHERE identifier = ?"
  const [results] = await pool.query(query, [identifier]);
  const phoneNumber = <IPhoneNumber[]>results;
  return phoneNumber[0].phone_number;
}

export async function useIdentifier(): Promise<string> {
  const identifier = await ESX.GetPlayerFromId(getSource()).getIdentifier()
  return identifier;
}