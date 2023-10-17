import { mainLogger } from '../sv_logger';
import PlayerService from './player.service';

export const playerLogger = mainLogger.child({
  module: 'player',
});

export async function getDefaultProfileNames(source: number): Promise<string[]> {
  const defaultProfileNames: string[] = [];
  const player = PlayerService.getPlayer(source);

  if (player.getFirstName() && player.getLastName()) {
    defaultProfileNames.push(`${player.getFirstName()}_${player.getLastName()}`);
  } else if (player.getFirstName()) {
    defaultProfileNames.push(player.getFirstName());
  } else if (player.getLastName()) {
    defaultProfileNames.push(player.getLastName());
  }

  if (player.getPhoneNumber()) {
    defaultProfileNames.push(player.getPhoneNumber());
  }
  return defaultProfileNames;
}
