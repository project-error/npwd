import PlayerService from '../players/player.service';
import { clean } from './miscUtils';
/**
 * Generate a profile name by the player's name and/or phone number
 * @param identifier - player's identifier
 * @param delimiter - What we split the profile name by, defaults to -
 */
export async function generateProfileName(
  identifier: string,
  delimiter: string = '_',
): Promise<string | null> {
  const player = PlayerService.getPlayerFromIdentifier(identifier);

  const firstname = clean(player.getFirstName());
  const lastname = clean(player.getLastName());
  const phone_number = clean(player.getPhoneNumber());

  if (firstname && lastname) {
    return `${firstname}${delimiter}${lastname}`;
  } else if (firstname) {
    return firstname;
  } else if (lastname) {
    return lastname;
  } else if (phone_number) {
    return phone_number;
  }
  return null;
}
