import { pool } from './db';
import { ESX } from './server';

interface IPhoneNumber {
  phone_number: string;
}

interface Identifier {
  identifier: string;
}

export async function usePhoneNumber(identifier: string): Promise<string> {
  const query = 'SELECT phone_number FROM users WHERE identifier = ?';
  const [results] = await pool.query(query, [identifier]);
  const phoneNumber = <IPhoneNumber[]>results;
  return phoneNumber[0].phone_number;
}

export const getSource = () => (global as any).source;

export function getIdentifier(source: number): string {
  return ESX.GetPlayerFromId(source).getIdentifier();
}

export async function getIdentifierByPhoneNumber(
  phoneNumber: string
): Promise<string> {
  const query = 'SELECT identifier FROM users WHERE phone_number = ?';
  const [results] = await pool.query(query, [phoneNumber]);
  const identifier = <Identifier[]>results;
  return identifier[0].identifier;
}
