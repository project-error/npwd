import { mainLogger } from '../sv_logger';
import PlayerService from './player.service';

export const playerLogger = mainLogger.child({
  module: 'player',
});

const clean = (input: string) => (input ? input.replace(/[^0-9a-z]/gi, '') : input);

export async function getDefaultProfileNames(source: number): Promise<string[]> {
  //const { firstname, lastname, phone_number } = await getCleanedPlayerInfo(identifier);
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
