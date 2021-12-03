import { generateUniquePhoneNumber } from '../misc/generateUniquePhoneNumber';
import { bridgeLogger } from './bridge.utils';
import { config } from '../server';
import { PlayerAddData } from '../players/player.interfaces';
import { playerLogger } from '../players/player.utils';
import PlayerService from '../players/player.service';
import { PhoneEvents } from '../../../typings/phone';

const exp = global.exports;

const logExport = (exportName: string, msg: string) => {
  bridgeLogger.debug(`[${exportName}] ${msg}`);
};

// Will generate and return a unique phone number
exp('generatePhoneNumber', async () => {
  const num = await generateUniquePhoneNumber();
  logExport('generatePhoneNumber', num);
  return num;
});

// For multicharacter frameworks, we enable these events for
// instantiating/deleting a player. The config option must be set to true
// for these to be available
if (config.general.enableMultiChar) {
  exp('newPlayer', async (playerDTO: PlayerAddData) => {
    if (typeof playerDTO.source !== 'number') {
      return playerLogger.error('Source must be passed as a number when loading a player');
    }
    await PlayerService.handleNewPlayerEvent(playerDTO);
    emitNet(PhoneEvents.SET_PLAYER_LOADED, playerDTO.source, true);
  });

  exp('unloadPlayer', async (src: number) => {
    if (typeof src !== 'number') {
      return playerLogger.error('Source must be passed as a number when unloading a player');
    }
    playerLogger.debug(`Received unloadPlayer event for ${src}`);
    await PlayerService.handleUnloadPlayerEvent(src);
  });
}
