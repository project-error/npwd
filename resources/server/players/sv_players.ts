import { mainLogger } from '../sv_logger';
import { pool } from '../db';
import { generatePhoneNumber } from '../functions';
import { PhoneEvents } from '../../../typings/phone';

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
    const phone_number = await generatePhoneNumber(playerIdentifer);

    // Get player info to populate class instance
    let playerInfo = { firstname: '', lastname: '' };
    try {
      playerInfo = await getPlayerInfo(playerIdentifer);
    } catch (e) {
      playerLogger.debug(
        `Failed to get player info, defaulting to phone number as profile, ${e.message}`,
        {
          source: pSource,
        },
      );
    }
    const { firstname, lastname } = playerInfo;

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
    emitNet(PhoneEvents.PLAYER_IS_READY, pSource);
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

const clean = (input: string) => (input ? input.replace(/[^0-9a-z]/gi, '') : input);

async function getCleanedPlayerInfo(identifier: string): Promise<PlayerQueryResp> {
  const { firstname, lastname, phone_number } = await getPlayerInfo(identifier);
  return {
    firstname: clean(firstname),
    lastname: clean(lastname),
    phone_number: clean(phone_number),
  };
}

/**
 * Generate a profile name by the player's name and/or phone number
 * @param identifier - player's identifier
 */
export async function generateProfileName(
  identifier: string,
  delimiter: string = '_',
): Promise<string | null> {
  const { firstname, lastname, phone_number } = await getCleanedPlayerInfo(identifier);

  if (firstname && lastname) {
    return `${firstname}${delimiter}${lastname}`;
  } else if (firstname) {
    return firstname;
  } else if (lastname) {
    return lastname;
  } else if (phone_number) {
    return phone_number;
  }
  return null;
}

export async function getDefaultProfileNames(identifier: string): Promise<string[]> {
  const { firstname, lastname, phone_number } = await getCleanedPlayerInfo(identifier);
  let defaultProfileNames = [];

  if (firstname && lastname) {
    defaultProfileNames.push(`${firstname}_${lastname}`);
  } else if (firstname) {
    defaultProfileNames.push(firstname);
  } else if (lastname) {
    defaultProfileNames.push(lastname);
  }

  if (phone_number) {
    defaultProfileNames.push(phone_number);
  }
  return defaultProfileNames;
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
    this._firstname = firstname;
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
    this._lastname = lastname;
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
