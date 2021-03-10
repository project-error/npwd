import { pool } from './db';
import config from '../utils/config';
import { mainLogger } from './sv_logger';
import { Player, Players, PlayersByIdentifier } from './players/sv_players';

export function getPlayer(source: number): Player {
  const player = Players.get(source);
  if (!player) mainLogger.error(`Could not find player from source: ${source}`);
  return player;
}

export const getSource = () => (global as any).source;

// we might need to run a db query on this.
// to make it more standalone
/**
 * Return the identifier for an online player
 * @param source The source/netId for the player in question
 **/
export function getIdentifier(source: number): string {
  return getPlayer(source).identifier;
}

/**
 * Return the attached identifier for a given phone number
 * @param phoneNumber The phone number to return identifier for
 * @param fetch Whether or not to query the database if a given player is offline
 **/
export async function getIdentifierByPhoneNumber(
  phoneNumber: string,
  fetch?: boolean,
): Promise<string | null> {
  for (const [source, player] of Players) {
    if (player.getPhoneNumber() === phoneNumber) return player.identifier;
  }
  // Whether we fetch from database if not found in online players
  if (fetch) {
    const query = `SELECT identifier FROM users WHERE phone_number = ?`
    const [results] = await pool.query(query, [phoneNumber]);
    // Get identifier from results
    return (results as { identifier: string }[])[0].identifier;
  }
  return null;
}

/**
 * Returns the player phoneNumber for a passed identifier
 * @param identifier The players phone number
 */
export function getPlayerFromIdentifier(identifier: string) {
  const player = PlayersByIdentifier.get(identifier);
  if (!player) mainLogger.error(`Could not find player from identifier: ${identifier}`);
  return player;
}

function getRandomPhoneNumber() {
  let randomNumber: string = null;

  if (!config.general.useDashNumber) {
    randomNumber = Math.floor(Math.random() * 10000000).toString(); // 10000000 creates a number with 7 characters.
  } else {
    randomNumber = Math.floor(Math.random() * 10000000)
      .toString()
      .replace(/(\d{3})(\d{4})/, '$1-$2');
    // The numbers inside {} in replace() can be changed to how many digits you want on each side of the dash.
    // Example: 123-4567
  }
  mainLogger.debug(`Getting random number: ${randomNumber}`);

  return randomNumber;
}

export async function generatePhoneNumber(identifier: string): Promise<void> {
  const getQuery = `SELECT phone_number FROM users WHERE identifier = ?`;
  const [results] = await pool.query(getQuery, [identifier]);
  const result = <any[]>results;
  const phoneNumber = result[0]?.phone_number;

  if (!phoneNumber) {
    let existingId;
    let newNumber;
    do {
      newNumber = getRandomPhoneNumber();
      try {
        existingId = await getIdentifierByPhoneNumber(newNumber);
      } catch (e) {
        existingId = false;
      }
    } while (existingId);
    mainLogger.debug(`Inserting number into Database: ${newNumber}`);
    const query = 'UPDATE users SET phone_number = ? WHERE identifier = ?';
    await pool.query(query, [newNumber, identifier]);
  }
}
