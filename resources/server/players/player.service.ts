import { findOrGeneratePhoneNumber } from '../misc/functions';
import { PhoneEvents } from '../../../typings/phone';
import { Player } from './player.class';
import { PlayerAddData } from './player.interfaces';
import Collection from '@discordjs/collection';
import { getPlayerGameLicense } from '../utils/getPlayerGameLicense';
import playerDB, { PlayerRepo } from './player.db';
import { playerLogger } from './player.utils';

class _PlayerService {
  private readonly playersBySource: Collection<number, Player>;
  private readonly playersByIdentifier: Collection<string, Player>;
  private readonly playerDB: PlayerRepo;

  constructor() {
    this.playersBySource = new Collection<number, Player>();
    this.playersByIdentifier = new Collection<string, Player>();
    this.playerDB = playerDB;
    playerLogger.debug('Player Service started');
  }

  /**
   * Adds a Player instance to the source & identifier maps
   * @param source - The player's source
   * @param player - The player instance to use as a value
   */

  addPlayerToMaps(source: number, player: Player) {
    this.playersBySource.set(source, player);
    this.playersByIdentifier.set(player.getIdentifier(), player);
  }

  /**
   * Deletes a player from both map by source & identifier
   * @param source - The player's source
   */
  deletePlayerFromMaps(source: number) {
    const identifier = this.playersBySource.get(source).getIdentifier();
    this.playersByIdentifier.delete(identifier);
    this.playersBySource.delete(source);
  }
  /**
   * Returns the player instance for a given source
   * Will return null if no player is found online with that source
   **/
  getPlayer(source: number): Player | null {
    const player = this.playersBySource.get(source);
    if (!player) return null;
    return player;
  }

  /**
   * Returns the player identifier for a given source
   * Will return null if no player is found online with that source
   **/
  getIdentifier(source: number): string {
    return this.getPlayer(source).getIdentifier();
  }

  /**
   * Returns the player phoneNumber for a passed identifier
   * @param identifier The players phone number
   */
  getPlayerFromIdentifier(identifier: string): Player | null {
    const player = this.playersByIdentifier.get(identifier);
    if (!player) {
      throw new Error(`Could not find corresponding player for identifier: ${identifier}`);
    }
    return player;
  }

  /**
   * Will return the given identifier from a phone number
   * @param phoneNumber - The phone number of the player
   * @param fetch - Whether to fetch for the identifier if they are offline
   **/
  async getIdentifierFromPhoneNumber(phoneNumber: string, fetch?: boolean): Promise<string | null> {
    const onlinePlayer = this.playersBySource.find(
      (player: Player) => player.getPhoneNumber() === phoneNumber,
    );
    // Return the player if they are online
    if (onlinePlayer) return onlinePlayer.getIdentifier();
    if (fetch) {
      const fetchResult: string | null = await this.playerDB
        .fetchIdentifierFromPhoneNumber(phoneNumber)
        .catch((e) => {
          playerLogger.error(
            `Failed to fetch identifier from phone number for ${phoneNumber}, error: ${e.message}`,
          );
          return null;
        });

      return fetchResult;
    }
    // Return null if all else doesn't return
    return null;
  }

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

    const phone_number = await findOrGeneratePhoneNumber(playerIdentifier);

    const newPlayer = new Player({
      identifier: playerIdentifier,
      source: pSource,
      username,
      phoneNumber: phone_number,
    });

    this.addPlayerToMaps(pSource, newPlayer);

    playerLogger.info('NPWD Player Loaded!');
    playerLogger.debug(newPlayer);
    emitNet(PhoneEvents.ON_INIT, pSource);
  }

  /**
   * Instantiate a basic Player instance from the constructor
   * @param src - The player source
   * @param identifier - The primary identifier
   *
   */

  async createNewPlayer({
    src,
    identifier,
  }: {
    src: number;
    identifier: string;
  }): Promise<Player | null> {
    const username = GetPlayerName(src.toString());

    const phoneNumber = await findOrGeneratePhoneNumber(identifier);

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
   * event while multichar is enabled.
   * @param NewPlayerDTO - A DTO with all the new info required to instantiate a new player
   *
   */
  async handleNewPlayerEvent({ source: src, identifier, firstname, lastname }: PlayerAddData) {
    const player = await this.createNewPlayer({ src, identifier: identifier.toString() });

    if (firstname) player.setFirstName(firstname);
    if (lastname) player.setLastName(lastname);

    this.addPlayerToMaps(src, player);

    playerLogger.info(`New NPWD Player added through event (${src}) (${identifier})`);
    playerLogger.debug(player);

    emitNet(PhoneEvents.ON_INIT, src);
  }

  /**
   * Return the attached identifier for a given phone number
   * @param phoneNumber The phone number to return identifier for
   * @param fetch Whether or not to query the database if a given player is offline
   **/
  async getIdentifierByPhoneNumber(phoneNumber: string, fetch?: boolean): Promise<string | null> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, player] of this.playersBySource) {
      if (player.getPhoneNumber() === phoneNumber) return player.getIdentifier();
    }
    // Whether we fetch from database if not found in online players
    if (fetch) {
      return await this.playerDB.fetchIdentifierFromPhoneNumber(phoneNumber);
    }
  }

  /**
   * Unload event handler
   * @param src - Source of player being unloaded
   **/
  handleUnloadPlayerEvent(src: number) {
    this.deletePlayerFromMaps(src);

    playerLogger.info(`Unloaded NPWD Player, source: (${src})`);
  }
}

const PlayerService = new _PlayerService();

export default PlayerService;
