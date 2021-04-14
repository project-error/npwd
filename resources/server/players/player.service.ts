import { mainLogger } from '../sv_logger';
import { generatePhoneNumber } from '../functions';
import { PhoneEvents } from '../../../typings/phone';
import { Player } from './player.class';
import { PlayerAddData } from './player.interfaces';
import Collection from '@discordjs/collection';
import { getPlayerGameLicense } from '../utils/getPlayerGameLicense';
import playerDB, { PlayerRepo } from './player.db';

export const playerLogger = mainLogger.child({
  module: 'player',
});

class PlayerService {
  private readonly playersBySource: Collection<number, Player>;
  private readonly playersByIdentifier: Collection<string, Player>;
  private readonly playerDB: PlayerRepo;

  constructor() {
    this.playersBySource = new Collection<number, Player>();
    this.playersByIdentifier = new Collection<string, Player>();
    this.playerDB = playerDB;
  }

  addPlayerToMaps(source: number, player: Player) {
    this.playersBySource.set(source, player);
    this.playersByIdentifier.set(player.getIdentifier(), player);
  }

  deletePlayerFromMaps(source: number) {
    const identifier = this.playersBySource.get(source).getIdentifier();
    this.playersByIdentifier.delete(identifier);
    this.playersBySource.delete(source);
  }

  getPlayer(source: number): Player {
    const player = this.playersBySource.get(source);
    if (!player) throw new Error(`Could not find player associated with source: ${source}`);
    return player;
  }

  getIdentifier(source: number): string {
    return this.getPlayer(source).getIdentifier();
  }

  /**
   * Returns the player phoneNumber for a passed identifier
   * @param identifier The players phone number
   */
  getPlayerFromIdentifier(identifier: string): Player | null {
    const player = this.playersByIdentifier.get(identifier);
    if (!player)
      throw new Error(`Could not find corresponding player for identifier: ${identifier}`);
    return player;
  }

  getIdentifierFromPhoneNumber(phoneNumber: string) {}

  /**
   * We call this function on the event `playerJoined`,
   * only if the multicharacter option is set to false in the config.
   * @param pSource - The source of the player to handle
   */
  async handleNewPlayerJoined(pSource: number) {
    const playerIdentifier = getPlayerGameLicense(pSource);

    if (!playerIdentifier) {
      throw new Error(`License identifier could not be found for source (${pSource})`);
    }

    const username = GetPlayerName(pSource.toString());
    playerLogger.info(`Started loading for ${username} (${pSource})`);
    // Ensure phone number exists or generate

    let phone_number: string;
    try {
      phone_number = await generatePhoneNumber(playerIdentifier);
    } catch (e) {
      return;
    }

    const newPlayer = new Player({
      identifier: playerIdentifier,
      source: pSource,
      username,
      phoneNumber: phone_number,
    });

    this.addPlayerToMaps(pSource, newPlayer);

    playerLogger.info('NPWD Player Loaded!');
    playerLogger.debug(newPlayer);

    // Emit to client that player is ready
    emitNet(PhoneEvents.PLAYER_IS_READY, pSource, true);
  }

  async createNewPlayer({
    src,
    identifier,
  }: {
    src: number;
    identifier: string;
  }): Promise<Player | null> {
    const username = GetPlayerName(src.toString());

    const phoneNumber = await generatePhoneNumber(identifier).catch((e) => {
      playerLogger.error(`Failed to generate phone number for source: ${src}. Error: ${e.message}`);
      return null;
    });

    if (!phoneNumber) return null;

    return new Player({
      source: src,
      identifier,
      phoneNumber,
      username,
    });
  }

  /**
   * We call this function whenever we receive a `npwd:newPlayer`
   * event while mutlchar is enabled.
   */
  async handleNewPlayerEvent({ source: src, identifier, firstname, lastname }: PlayerAddData) {
    const player = await this.createNewPlayer({ src, identifier });

    if (firstname) player.setFirstName(firstname);
    if (lastname) player.setLastName(lastname);

    this.addPlayerToMaps(src, player);

    playerLogger.info(`New NPWD Player added through event (${src}) (${identifier})`);
    playerLogger.debug(player);

    // Emit to client that player is ready
    emitNet(PhoneEvents.PLAYER_IS_READY, src, true);
  }

  /**
   * Return the attached identifier for a given phone number
   * @param phoneNumber The phone number to return identifier for
   * @param fetch Whether or not to query the database if a given player is offline
   **/
  async getIdentifierByPhoneNumber(phoneNumber: string, fetch?: boolean): Promise<string | null> {
    for (const [source, player] of this.playersBySource) {
      if (player.getPhoneNumber() === phoneNumber) return player.getIdentifier();
    }
    // Whether we fetch from database if not found in online players
    if (fetch) {
      return await this.playerDB.fetchIdentifierFromPhoneNumber(phoneNumber);
    }
  }

  handleUnloadPlayerEvent(src: number, playerDropped?: boolean) {
    this.deletePlayerFromMaps(src);

    playerLogger.info(`Unloaded NPWD Player, source: (${src})`);

    if (!playerDropped) {
      emitNet(PhoneEvents.PLAYER_IS_READY, src, false);
    }
  }
}

export default new PlayerService();
