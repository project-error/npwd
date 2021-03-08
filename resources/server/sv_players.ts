import { mainLogger } from './sv_logger';
import { generatePhoneNumber, getPlayer, getSource } from './functions';
import events from '../utils/events';
import { pool } from './db';

const playerLogger = mainLogger.child({
  module: 'player',
});

// Map of players by source
export const Players = new Map<number, Player>();
// Map of players by identifier
export const PlayersByIdentifier = new Map<string, Player>();

interface PlayerInfo {
  firstname: string;
  lastname: string;
  phone_number: string;
}
// Get initial player data to populate new class instance
async function getPlayerInfo(identifer: string): Promise<PlayerInfo> {
  const query = `SELECT firstname, lastname, phone_number
                 FROM users
                 WHERE identifier = ?`;

  const [results] = await pool.query(query, [identifer]);

  const creds = <PlayerInfo[]>results;
  if (!creds[0]) throw new Error('Could not get player information');

  const firstname = creds[0].firstname;
  const lastname = creds[0].lastname;

  const phone_number = creds[0].phone_number;
  return { firstname, lastname, phone_number };
}

on('playerJoining', async () => {
  const pSource = (global as any).source;

  const playerIdentifiers = getPlayerIdentifiers(pSource);
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
    playerLogger.debug('Loading NPWD player');
    // Ensure phone number exists or generate
    await generatePhoneNumber(playerIdentifer);

    // Get player info to populate class instance
    const { firstname, lastname, phone_number } = await getPlayerInfo(playerIdentifer);
    const newPlayer = new Player({
      identifier: playerIdentifer,
      source: pSource,
      firstname,
      lastname,
      phoneNumber: phone_number,
    });

    // Add to players by identifier map
    PlayersByIdentifier.set(newPlayer.identifier, newPlayer);

    // Add to players by source map
    Players.set(pSource, newPlayer);

    playerLogger.debug('Loaded NPWD Player');

    // Emit to client that player is ready
    emitNet(events.PLAYER_IS_READY, pSource);
  } catch (e) {
    playerLogger.error(`Failed to create a new player, ${e.message}`, {
      source: pSource,
    });
  }
});

// Handle removing from player maps when player disconnects
on('playerDropped', () => {
  const _source = getSource();
  // Get identifier for player to remove
  const playerIdentifier = getPlayer(_source).identifier;
  // Remove from player map by identifier
  PlayersByIdentifier.delete(playerIdentifier);
  // Remove from player map by source
  Players.delete(_source);

  mainLogger.info(`Unloaded NPWD Player, source: (${_source})`);
});

interface PlayerClassArgs {
  source: number;
  firstname: string;
  lastname: string;
  identifier: string;
  phoneNumber: string;
}

// Can add methods here to expand in the future
export class Player {
  public readonly source: number;
  public readonly identifier: string;
  public firstname: string;
  public lastname: string;
  public phoneNumber: string;

  constructor({ source, firstname, lastname, identifier, phoneNumber }: PlayerClassArgs) {
    this.source = source;
    this.identifier = identifier;
    this.firstname = firstname;
    this.lastname = lastname;
    this.phoneNumber = phoneNumber;
  }
}
