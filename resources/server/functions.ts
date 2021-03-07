import { IPlayer } from '../typings/players';
import { pool } from './db';
import { Players } from './sv_main';

interface IPhoneNumber {
  phone_number: string;
}

interface Identifier {
  identifier: string;
}

export async function usePlayer(
  identifier: string,
): Promise<Pick<IPlayer, 'name' | 'phone_number'>> {
  const query = `SELECT firstname, lastname, phone_number FROM users WHERE identifier = ?`;
  const [results] = await pool.query(query, [identifier]);
  const creds = <{ firstname: string; lastname: string; phone_number: string }[]>results;

  const name = `${creds[0].firstname} ${creds[0].lastname}`;
  const phone_number = creds[0].phone_number;

  return { name, phone_number };
}

export function usePhoneNumber(identifier: string) {
  const player = getPlayerFromIdentifier(identifier);
  return player?.phone_number || null;
}

export function useName(identifer: string) {
  const player = getPlayerFromIdentifier(identifer);
  return player?.name || null;
}

export const getSource = () => (global as any).source;

// we might need to run a db query on this.
// to make it more standalone
export function getIdentifier(source: number): string {
  const player = getPlayerBySource(source);
  return player?.identifier || null;
}

export async function getIdentifierByPhoneNumber(phoneNumber: string): Promise<string> {
  const query = 'SELECT identifier FROM users WHERE phone_number = ?';
  const [results] = await pool.query(query, [phoneNumber]);
  const identifier = <Identifier[]>results;
  return identifier[0].identifier;
}

export const getPlayerBySource = (source: any) => {
  return Players.get(source);
};

/**
 * Returns the player phoneNumber for a passed identifier
 * @param identifier The players phone number
 */
export function getPlayerFromIdentifier(identifier: string) {
  for (const player of Array.from(Players.entries())) {
    if (player[1].identifier === identifier) {
      return player[1];
    }
  }
  return null;
}
