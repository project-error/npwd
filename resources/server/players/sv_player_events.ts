import { generatePhoneNumber, getPlayer, getSource } from '../functions';
import events from '../../utils/events';
import { mainLogger } from '../sv_logger';
import {
  getPlayerInfo,
  handlePlayerAdd,
  Player,
  playerLogger,
  Players,
  PlayersByIdentifier,
} from './sv_players';

on('playerJoining', async () => {
  const _source = getSource();
  await handlePlayerAdd(_source);
  mainLogger.debug(`Event Source Type: ${typeof _source}`);
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

RegisterCommand(
  'getPlayers',
  () => {
    playerLogger.debug(Players);
  },
  false,
);

on('onServerResourceStart', async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    // Workaround till https://github.com/citizenfx/fivem/pull/682
    // is merged
    // @ts-ignore
    const onlinePlayers: string[] = getPlayers();
    for (const player of onlinePlayers) {
      mainLogger.debug(`Type for getPlayers: ${typeof player}`);
      await handlePlayerAdd(parseInt(player));
    }
  }
});
