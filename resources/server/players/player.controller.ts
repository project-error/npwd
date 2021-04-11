import { getSource } from '../functions';
import {
  handleNewPlayerEvent,
  handleNewPlayerJoined,
  handleUnloadPlayerEvent,
  playerLogger,
} from './player.service';
import config from '../../utils/config';
import { PlayerAddData } from './player.interfaces';

/**
 * Essentially this whole file acts as a controller layer
 * for player related actions. Everything here is registered,
 * within the global scope like routes in a web server.
 */

// If multicharacter mode is disabled, we instantiate a new
// NPWD player by ourselves without waiting for an export

if (!config.general.enableMultiChar) {
  on('playerJoining', async () => {
    const _source = getSource();
    await handleNewPlayerJoined(_source);
  });
}

// Handle removing from player maps when player disconnects
on('playerDropped', () => {
  const source = getSource();
  // Get identifier for player to remove
  handleUnloadPlayerEvent(source, true);
});

// Can use this to debug the player table if needed. Disabled by default
// RegisterCommand(
//   'getPlayers',
//   () => {
//     playerLogger.debug(Players);
//   },
//   false,
// );

// Used for debug purposes, if the resource is restarted and the multicharacter option is false
// we will handle all the currently online players
if (!config.general.enableMultiChar) {
  on('onServerResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
      // Workaround till https://github.com/citizenfx/fivem/pull/682
      // is merged
      // @ts-ignore
      const onlinePlayers: string[] = getPlayers();
      for (const player of onlinePlayers) {
        await handleNewPlayerJoined(parseInt(player));
      }
    }
  });
}

// For multicharacter frameworks, we enable these events for
// instantiating/deleting a player. The config option must be set to true
// for these to be available
if (config.general.enableMultiChar) {
  // This has to be an event as FXServer does not yet support exports which return a promise.
  on('npwd:newPlayer', async (playerDTO: PlayerAddData) => {
    playerLogger.debug('Receive newPlayer event, data:');
    playerLogger.debug(playerDTO);
    await handleNewPlayerEvent(playerDTO);
  });

  on('npwd:unloadPlayer', (source: number) => {
    playerLogger.debug(`Received unloadPlayer event for ${source}`);
    handleUnloadPlayerEvent(source);
  });
}
