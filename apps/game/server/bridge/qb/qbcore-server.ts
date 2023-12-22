import { config } from '@npwd/config/server';
import PlayerService from '../../players/player.service';
import { mainLogger } from '../../sv_logger';
import { Strategy } from '../framework-strategy';

export class QBCoreFramework implements Strategy {
  constructor() {
    mainLogger.info('Loading QBCore bridge....');

    config.general.useResourceIntegration = true;
    config.database.identifierColumn = 'citizenid';
    config.database.phoneNumberColumn = 'phone_number';
    config.database.playerTable = 'players';
    config.database.identifierType = 'license';
  }

  init(): void {
    on('QBCore:Server:PlayerLoaded', async (qbPlayer: any) => {
      const playerIdent = qbPlayer.PlayerData.citizenid;
      const phoneNumber = qbPlayer.PlayerData.charinfo.phone;
      const charInfo = qbPlayer.PlayerData.charinfo;
      const playerSrc = qbPlayer.PlayerData.source;

      await PlayerService.handleNewPlayerEvent({
        identifier: playerIdent,
        source: playerSrc,
        phoneNumber: phoneNumber.toString(),
        firstname: charInfo.firstname,
        lastname: charInfo.lastname,
      });
    });

    on("QBCore:Server:OnPlayerUnload", async () => {
      await PlayerService.handleUnloadPlayerEvent(global.source);
    })
  }

  onStart(): void {
    on('onServerResourceStart', async (resource: string) => {
      const QBCore = global.exports['qb-core'].GetCoreObject();

      if (resource === GetCurrentResourceName()) {
        const onlinePlayers = QBCore.Functions.GetQBPlayers();
        for (const player of onlinePlayers) {
          await PlayerService.handleNewPlayerEvent({
            source: player.PlayerData.source,
            identifier: player.PlayerData.citizenid,
            phoneNumber: player.PlayerData.charinfo.phone.toString(),
            firstname: player.PlayerData.charinfo.firstname,
            lastname: player.PlayerData.charinfo.lastname,
          });
        }
      }
    });
  }
}
