import { getSource } from '../utils/miscUtils';
import PlayerService from './player.service';
import { config } from '../config';
import { playerLogger } from './player.utils';
import { PhoneEvents } from '@typings/phone';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNet(PhoneEvents.FETCH_CREDENTIALS, () => {
  const src = getSource();
  const phoneNumber = PlayerService.getPlayer(src).getPhoneNumber();

  emitNet(PhoneEvents.SEND_CREDENTIALS, src, phoneNumber, src);
});

onNetPromise<void, string>(PhoneEvents.GET_PHONE_NUMBER, async (reqObj, resp) => {
  const src = reqObj.source;

  const phoneNumber = PlayerService.getPlayer(src).getPhoneNumber();

  resp({ status: 'ok', data: phoneNumber });
});

/**
 * Essentially this whole file acts as a controller layer
 * for player related actions. Everything here is registered,
 * within the global scope like routes in a web server.
 */

// If multicharacter mode is disabled, we instantiate a new
// NPWD player by ourselves without waiting for an export

if (!config.general.useResourceIntegration) {
  on('playerJoining', async () => {
    const src = getSource();
    await PlayerService.handleNewPlayerJoined(src);
  });
}

// Handle removing from player maps when player disconnects
on('playerDropped', async () => {
  const src = getSource();
  // Get identifier for player to remove
  try {
    await PlayerService.handleUnloadPlayerEvent(src);
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
if (!config.general.useResourceIntegration) {
  on('onServerResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
      const onlinePlayers = getPlayers();
      for (const player of onlinePlayers) {
        await PlayerService.handleNewPlayerJoined(parseInt(player));
      }
    }
  });
}
