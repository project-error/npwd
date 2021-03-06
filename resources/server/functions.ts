import { pool } from './db';
import { ESX } from './server';
import { XPlayer } from 'esx.js/@types/server';

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

// we might need to run a db query on this.
// to make it more standalone
export async function getIdentifier(source: number): Promise<string> {
  const _ESX = await ESX();
  return _ESX.GetPlayerFromId(source).getIdentifier();
}

export async function getIdentifierByPhoneNumber(phoneNumber: string): Promise<string> {
  const query = 'SELECT identifier FROM users WHERE phone_number = ?';
  const [results] = await pool.query(query, [phoneNumber]);
  const identifier = <Identifier[]>results;
  return identifier[0].identifier;
}

/**
 * Returns the player phoneNumber for a passed identifier
 * @param identifier The players phone number
 */
export async function getPlayerFromIdentifier(identifier: string): Promise<XPlayer> {
  const _ESX = await ESX();
  return new Promise((res, rej) => {
    const xPlayers = _ESX.GetPlayers();

    for (const player of xPlayers) {
      const xPlayer = _ESX.GetPlayerFromId(player);
      if (xPlayer.getIdentifier() != null && xPlayer.getIdentifier() == identifier) {
        res(xPlayer);
      }
    }

    rej(new Error('Call Target Identifier was not found in xPlayers array'));
  });
}
