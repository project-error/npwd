import { config } from '@npwd/config/server';
import PlayerService from '../../players/player.service';
import { mainLogger } from '../../sv_logger';
import { Strategy } from '../framework-strategy';

export class ESXFramework implements Strategy {
  constructor() {
    mainLogger.info('Loading ESX bridge....');

    config.general.useResourceIntegration = true;
    config.database.identifierColumn = 'identifier';
    config.database.phoneNumberColumn = 'phone_number';
    config.database.playerTable = 'users';
    config.database.identifierType = 'license';
  }

  init(): void {
    on('esx:playerLoaded', async (playerId: number, xPlayer: any) => {
        const ESX  = global.exports['es_extended'].getSharedObject();

        if (!xPlayer) {
            xPlayer = ESX.GetPlayerFromId(playerId);
        }

      await PlayerService.handleNewPlayerEvent({
        identifier: xPlayer.identifier,
        source: playerId,
        firstname: xPlayer.firstname || xPlayer.variables?.lastName || xPlayer.get('firstName'),
        lastname: xPlayer.lastname || xPlayer.variables?.lastName || xPlayer.get('lastName'),
      });
    });

    on("esx:playerLogout", async () => {
      await PlayerService.handleUnloadPlayerEvent(global.source);
    }) 

    mainLogger.info('ESX bridge initialized');
  }

  onStart(): void {
    on('onServerResourceStart', async (resource: string) => {
      const ESX  = global.exports['es_extended'].getSharedObject();

      if (resource === GetCurrentResourceName()) {
        const xPlayers = ESX.GetPlayers();

        for (const xPlayer of xPlayers) {
          await PlayerService.handleNewPlayerEvent({
            identifier: xPlayer.identifier,
            source: xPlayer.source,
            firstname: xPlayer.firstname || xPlayer.variables?.lastName || xPlayer.get('firstName'),
            lastname: xPlayer.lastname || xPlayer.variables?.lastName || xPlayer.get('lastName'),
          });
        }
      }
    });
  }
}
