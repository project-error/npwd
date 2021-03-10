import { mainLogger } from '../sv_logger';
import { pool } from '../db';
import { generatePhoneNumber, getSource } from '../functions';
import events from '../../utils/events';

export const playerLogger = mainLogger.child({
  module: 'player',
});

// Map of players by source
export const Players = new Map<number, Player>();
// Map of players by identifier
export const PlayersByIdentifier = new Map<string, Player>();

export async function handlePlayerAdd(pSource: number) {
  const playerIdentifiers = getPlayerIdentifiers(pSource.toString());

  // Parse specifically for license identifier as its
  // guranteed
  let playerIdentifer;
  for (const identifier of playerIdentifiers) {
    if (identifier.includes('license:')) {
      playerIdentifer = identifier.split(':')[1];
    }
  }

  if (!playerIdentifer) {
    throw new Error('License identifier could not be found.');
  }

  try {
    const username = GetPlayerName(pSource.toString());
    playerLogger.info(`Started loading for ${username} (${pSource})`);
    // Ensure phone number exists or generate
    await generatePhoneNumber(playerIdentifer);

    // Get player info to populate class instance
    const { firstname, lastname, phone_number } = await getPlayerInfo(playerIdentifer);

    const newPlayer = new Player({
      identifier: playerIdentifer,
      source: pSource,
      username,
      firstname,
      lastname,
      phoneNumber: phone_number,
    });

    // Add to players by identifier map
    PlayersByIdentifier.set(newPlayer.identifier, newPlayer);

    // Add to players by source map
    Players.set(pSource, newPlayer);

    playerLogger.info('NPWD Player Loaded!');
    playerLogger.debug(newPlayer);

    // Emit to client that player is ready
    emitNet(events.PLAYER_IS_READY, pSource);
  } catch (e) {
    playerLogger.error(`Failed to create a new player, ${e.message}`, {
      source: pSource,
    });
  }
}

interface PlayerQueryResp {
  firstname: string;
  lastname: string;
  phone_number: string;
}

// Get initial player data to populate new class instance
// NOTE: We should make this more generic and as easily configurable as possible
export async function getPlayerInfo(identifier: string): Promise<PlayerQueryResp> {
  const query = `SELECT firstname, lastname, phone_number
                 FROM users
                 WHERE identifier = ?`;

  const [results] = await pool.query(query, [identifier]);

  const creds = <PlayerQueryResp[]>results;
  if (!creds[0]) throw new Error(`Could not get player information for ${identifier}`);

  const firstname = creds[0].firstname;
  const lastname = creds[0].lastname;

  const phone_number = creds[0].phone_number;
  return { firstname, lastname, phone_number };
}

// Attach to playerJoining event as this is when
// the permanent source is assigned for the user

interface PlayerClassArgs {
  source: number;
  username: string;
  firstname: string;
  lastname: string;
  identifier: string;
  phoneNumber: string;
}

// Public getters/setters are for servers with multicharacter systems
// who need to switch certain information when character is changed

export class Player {
  public readonly source: number;
  public readonly identifier: string;
  public readonly username: string;
  private _firstname: string;
  private _lastname: string;
  private _phoneNumber: string;

  constructor({ source, firstname, lastname, identifier, phoneNumber, username }: PlayerClassArgs) {
    this.source = source;
    this.identifier = identifier;
    this._firstname = firstname;
    this._lastname = lastname;
    this._phoneNumber = phoneNumber;
    this.username = username;
  }
  /**
   * Returns the stored firstname for a user
   **/
  public getFirstName(): string {
    return this._firstname;
  }

  /**
   * Set the first name for a user
   * @param firstname {string} The first name to set for the user
   **/
  public setFirstName(firstname: string): void {
    this._firstname = name;
  }

  /**
   * Returns the stored lastname for a user
   **/
  public getLastName(): string {
    return this._lastname;
  }

  /**
   * Set the last name for a user
   * @param lastname {string} The last name to set for the user
   **/
  public setLastName(lastname: string): void {
    this._lastname = name;
  }

  /**
   * Get the full name of the user
   **/
  public getName(): string {
    return `${this._firstname} ${this._lastname}`;
  }

  /**
   * Get the stored phone number for a user
   **/
  public getPhoneNumber(): string {
    return this._phoneNumber;
  }

  /**
   * Set the stored phone number for a user
   **/
  public setPhoneNumber(number: string): void {
    this._phoneNumber = number;
  }
}
