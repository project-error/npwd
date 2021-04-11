import { mainLogger } from '../sv_logger';
import { generatePhoneNumber, getPlayer, getPlayerFromIdentifier } from '../functions';
import { PhoneEvents } from '../../../typings/phone';
import { Player } from './player.class';
import { Players, PlayersByIdentifier } from './player.provider';
import { PlayerAddData } from './player.interfaces';

export const playerLogger = mainLogger.child({
  module: 'player',
});

/**
 * We call this function on the event `playerJoined`,
 * only if the multicharacter option is set to false in the config.
 * @param pSource - The source of the player to handle
 */
export async function handleNewPlayerJoined(pSource: number) {
  const playerIdentifiers = getPlayerIdentifiers(pSource.toString());

  // Parse specifically for license identifier as its
  // guaranteed
  let playerIdentifier;
  for (const identifier of playerIdentifiers) {
    if (identifier.includes('license:')) {
      playerIdentifier = identifier.split(':')[1];
    }
  }

  if (!playerIdentifier) {
    throw new Error('License identifier could not be found.');
  }

  try {
    const username = GetPlayerName(pSource.toString());
    playerLogger.info(`Started loading for ${username} (${pSource})`);
    // Ensure phone number exists or generate
    const phone_number = await generatePhoneNumber(playerIdentifier);

    const newPlayer = new Player({
      identifier: playerIdentifier,
      source: pSource,
      username,
      phoneNumber: phone_number,
    });

    // Add to players by identifier map
    PlayersByIdentifier.set(newPlayer.getIdentifier(), newPlayer);

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

/**
 * We call this function whenever we receive a `npwd:newPlayer`
 * event while mutlchar is enabled.
 */
export async function handleNewPlayerEvent({
  source,
  identifier,
  firstname,
  lastname,
}: PlayerAddData) {
  try {
    const username = GetPlayerName(source.toString());

    // Generate or return a phone number if already exists
    const phoneNumber = await generatePhoneNumber(identifier);

    const player = new Player({
      source,
      identifier,
      phoneNumber,
      username,
    });

    if (firstname) player.setFirstName(firstname);
    if (lastname) player.setLastName(lastname);

    // Set up player maps
    Players.set(source, player);
    PlayersByIdentifier.set(identifier, player);

    playerLogger.info(`New NPWD Player added through event (${source}) (${identifier})`);
    playerLogger.debug(player);
  } catch (e) {
    playerLogger.error(`Failed to create a new player through event, ${e.message}`, {
      source,
    });
  }
}

export function handleUnloadPlayerEvent(source: number) {
  if (typeof source !== 'number') {
    return playerLogger.error('Source must be passed as a number to npwd:handleUnloadPlayer');
  }
  const identifier = getPlayer(source).getIdentifier();

  // Remove from maps
  Players.delete(source);
  PlayersByIdentifier.delete(identifier);

  playerLogger.info(`Unloaded NPWD Player, source: (${source})`);
}

const clean = (input: string) => (input ? input.replace(/[^0-9a-z]/gi, '') : input);

/**
 * Generate a profile name by the player's name and/or phone number
 * @param identifier - player's identifier
 * @param delimiter - What we split the profile name by, defaults to -
 */
export async function generateProfileName(
  identifier: string,
  delimiter: string = '_',
): Promise<string | null> {
  const player = getPlayerFromIdentifier(identifier);

  const firstname = clean(player.getFirstName());
  const lastname = clean(player.getLastName());
  const phone_number = clean(player.getPhoneNumber());

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

/**
 * Generate default profile names to use for apps like twitter.
 * @param identifier - The identifier to generate the profiles from.
 */
export async function getDefaultProfileNames(identifier: string): Promise<string[]> {
  const player = getPlayerFromIdentifier(identifier);

  const firstname = clean(player.getFirstName());
  const lastname = clean(player.getLastName());

  const phone_number = clean(player.getPhoneNumber());

  const defaultProfileNames = [];

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
