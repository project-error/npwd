import { getPlayer, getSource } from '../functions';
import { mainLogger } from '../sv_logger';
import { handlePlayerAdd, Players, PlayersByIdentifier } from './sv_players';

on('playerJoining', async () => {
  const _source = getSource();
  await handlePlayerAdd(_source);
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
