import { getPlayer, getSource } from '../functions';
import { mainLogger } from '../sv_logger';
import { handlePlayerAdd, playerLogger, Players, PlayersByIdentifier } from './sv_players';

/**
 * Essentially this whole file acts as a controller layer
 * for player related actions. Everything here is registered,
 * within the global scope like routes in a web app.
 */

on('playerJoining', async () => {
  const _source = getSource();
  await handlePlayerAdd(_source);
});

// Handle removing from player maps when player disconnects
on('playerDropped', () => {
  const _source = getSource();
  // Get identifier for player to remove
  const playerIdentifier = getPlayer(_source).getIdentifier();
  // Remove from player map by identifier
  PlayersByIdentifier.delete(playerIdentifier);
  // Remove from player map by source
  Players.delete(_source);

  mainLogger.info(`Unloaded NPWD Player, source: (${_source})`);
});

// Can use this to debug the player table if needed. Disabled by default
// RegisterCommand(
//   'getPlayers',
//   () => {
//     playerLogger.debug(Players);
//   },
//   false,
// );

on('onServerResourceStart', async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    // Workaround till https://github.com/citizenfx/fivem/pull/682
    // is merged
    // @ts-ignore
    const onlinePlayers: string[] = getPlayers();
    for (const player of onlinePlayers) {
      await handlePlayerAdd(parseInt(player));
    }
  }
});

/**
 * This sets the identifier for an NPWD player using source as the target
 *
 * @param source {number} - The source of the player to target
 * @param identifier {string} - The identifier for this player to receive
 */
exports('setNpwdIdentifier', (source: number, identifier: string) => {
  if (typeof source !== 'number') {
    playerLogger.error('Source must be passed as a number to setNpwdIdentifier');
    return;
  }
  const npwdPlayer = Players.get(source);
  const playerLicense = npwdPlayer.getIdentifier();

  // We need to remove the identifier mapped player first
  PlayersByIdentifier.delete(playerLicense);

  // Now we update the reference for the source map player & identifier
  npwdPlayer.setIdentifier(identifier);

  // Create a new identifier mapped player using updated reference
  PlayersByIdentifier.set(identifier, npwdPlayer);
});

/**
 * This sets the RP name for an NPWD player using source as the target
 *
 * @param source {number} - The source of the player to target
 * @param firstname {string} - The RP first name for this player
 * @param lastname {string} - The RP last name for this player
 */
exports('setNpwdName', (source: number, firstname: string, lastname: string) => {
  if (typeof source !== 'number') {
    playerLogger.error('Source must be passed as a number to setNpwdIdentifier');
    return;
  }

  // I don't remember if JS treats maps as references or clones, because if they
  // are references when we set, we don't need to update the player twice here but oh well
  // exec time isn't much more.

  const npwdPlayer = Players.get(source);
  const npwdPlayerIdentifier = npwdPlayer.getIdentifier();

  // Set lastname and firstname
  npwdPlayer.setFirstName(firstname);
  npwdPlayer.setLastName(lastname);

  // Update identifier map
  PlayersByIdentifier.set(npwdPlayerIdentifier, npwdPlayer);
});
