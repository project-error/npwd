import { getSource } from '../utils/miscUtils';
import PlayerService from './player.service';
import { config } from '../server';
import { PlayerAddData } from './player.interfaces';
import { playerLogger } from './player.utils';
import { PhoneEvents } from '../../../typings/phone';

onNet(PhoneEvents.FETCH_CREDENTIALS, () => {
  const src = getSource();
  const phoneNumber = PlayerService.getPlayer(src).getPhoneNumber();

  emitNet(PhoneEvents.SEND_CREDENTIALS, src, phoneNumber);
});

/**
 * Essentially this whole file acts as a controller layer
 * for player related actions. Everything here is registered,
 * within the global scope like routes in a web server.
 */

// If multicharacter mode is disabled, we instantiate a new
// NPWD player by ourselves without waiting for an export

if (!config.general.enableMultiChar) {
  on('playerJoining', async () => {
    const src = getSource();
    await PlayerService.handleNewPlayerJoined(src);
  });
}

// Handle removing from player maps when player disconnects
on('playerDropped', () => {
  const src = getSource();
  // Get identifier for player to remove
  try {
    PlayerService.handleUnloadPlayerEvent(src);
  } catch (e) {
    playerLogger.debug(`${src} failed to unload, likely was never loaded in the first place.`);
  }
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
      const onlinePlayers = getPlayers();
      for (const player of onlinePlayers) {
        await PlayerService.handleNewPlayerJoined(parseInt(player));
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
    if (typeof playerDTO.source !== 'number') {
      return playerLogger.error('Source must be passed as a number when loading a player');
    }
    playerLogger.debug('Receive newPlayer event, data:');
    playerLogger.debug(playerDTO);
    await PlayerService.handleNewPlayerEvent(playerDTO);
  });

  on('npwd:unloadPlayer', (src: number) => {
    if (typeof src !== 'number') {
      return playerLogger.error('Source must be passed as a number when unloading a player');
    }
    playerLogger.debug(`Received unloadPlayer event for ${src}`);
    PlayerService.handleUnloadPlayerEvent(src);
  });
}
