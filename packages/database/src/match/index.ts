import { Like, Match, NewProfile, Profile } from '@typings/match';
import { pool } from '../db/pool';
import { ResultSetHeader } from 'mysql2';
import { config } from '@npwd/config/server';
import { generateProfileName } from '@game/server/utils/generateProfileName';
import { matchLogger } from '@game/server/match/match.utils';
import DbInterface from '../db/db_wrapper';

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
const MATCHES_PER_PAGE = 20;

export class _MatchDB {
  /**
   * Select profiles that:
   * 1. aren't the current player
   * 2. haven't been viewed before
   * 3. have been viewed before but that was at least 7 days ago
   * @param identifier - players identifier
   * @returns - array of profiles
   */
  async getPotentialProfiles(identifier: string): Promise<Profile[]> {
    const query = `
        SELECT npwd_match_profiles.*,
               UNIX_TIMESTAMP(npwd_match_profiles.updatedAt) AS lastActive,
               MaxDates.lastSeen,
               MaxDates.liked
        FROM npwd_match_profiles
                 LEFT OUTER JOIN (
            SELECT id, profile, liked, MAX(createdAt) AS lastSeen
            FROM npwd_match_views
            WHERE identifier = ?
            GROUP BY id, profile, liked
        ) AS MaxDates ON npwd_match_profiles.id = MaxDates.profile
        WHERE npwd_match_profiles.identifier != ?
          AND (MaxDates.lastSeen IS NULL OR MaxDates.lastSeen < NOW() - INTERVAL 7 DAY)
          AND MaxDates.liked IS NULL
        ORDER BY npwd_match_profiles.updatedAt DESC
        LIMIT 25
		`;
    const [results] = await DbInterface._rawExec(query, [identifier, identifier]);
    return <Profile[]>results;
  }

  /**
   * Save a list of Like objects
   * @param identifier - player's identifier
   * @param likes - likes to be saved to the database
   * @returns ResultSet
   */
  async saveLikes(identifier: string, like: Like): Promise<ResultSetHeader[]> {
    const query = `INSERT INTO npwd_match_views (identifier, profile, liked)
                   VALUES (?, ?, ?)`;

    const results = await DbInterface._rawExec(query, [identifier, like.id, like.liked]);
    return <ResultSetHeader[]>results;
  }

  /**
   * Determines if a profile we just liked has already liked us in the past which
   * indicates a match has occurred
   * @param identifier - player's identifier
   * @param id - profile ID we just liked
   * @returns Profile[] - list of profiles that are a match
   */
  async checkForMatchById(identifier: string, id: number): Promise<Profile[]> {
    const query = `
        SELECT targetProfile.*,
               UNIX_TIMESTAMP(targetProfile.updatedAt) AS lastActive
        FROM npwd_match_views
                 LEFT OUTER JOIN npwd_match_profiles AS playerProfile ON npwd_match_views.profile = playerProfile.id
                 LEFT OUTER JOIN npwd_match_profiles AS targetProfile
                                 ON npwd_match_views.identifier = targetProfile.identifier
        WHERE playerProfile.identifier = ?
          AND targetProfile.id = ?
          AND liked = 1
		`;
    const [results] = await DbInterface._rawExec(query, [identifier, id]);
    return <Profile[]>results;
  }

  /**
   * Return all matches associated with a player regardless of date/time. A
   * match is a case where two profiles have liked each other.
   * @param identifier - player's identifier
   * @param page
   * @returns Match[] - all matches associated with the current player
   */
  async findAllMatches(identifier: string, page: number): Promise<Match[]> {
    const offset = MATCHES_PER_PAGE * page;

    const query = `
        SELECT targetProfile.*,
               UNIX_TIMESTAMP(targetProfile.updatedAt)                                     AS lastActive,
               UNIX_TIMESTAMP(GREATEST(npwd_match_views.createdAt, targetViews.createdAt)) AS matchedAt,
               targetUser.${config.database.phoneNumberColumn}                             AS phoneNumber
        FROM npwd_match_views
                 LEFT OUTER JOIN npwd_match_profiles AS targetProfile ON npwd_match_views.profile = targetProfile.id
                 LEFT OUTER JOIN npwd_match_profiles AS myProfile ON npwd_match_views.identifier = myProfile.identifier
                 LEFT OUTER JOIN npwd_match_views AS targetViews
                                 ON targetProfile.identifier = targetViews.identifier AND
                                    targetViews.profile = myProfile.id
                 LEFT OUTER JOIN ${config.database.playerTable} AS targetUser ON targetProfile.identifier = targetUser.${config.database.identifierColumn}
        WHERE npwd_match_views.identifier = ?
          AND npwd_match_views.liked = 1
          AND targetViews.liked = 1
        ORDER BY matchedAt DESC
        LIMIT ? OFFSET ?
		`;
    const [results] = await DbInterface._rawExec(query, [
      identifier,
      MATCHES_PER_PAGE.toString(),
      offset.toString(),
    ]);
    return <Match[]>results;
  }

  /**
   * Retrieve the current player's profile
   * @param identifier - player's identifier
   * @returns Profile - player's current profile
   */
  async getPlayerProfile(identifier: string): Promise<Profile> {
    const query = `
        SELECT *,
               UNIX_TIMESTAMP(updatedAt) AS lastActive
        FROM npwd_match_profiles
        WHERE identifier = ?
        LIMIT 1
		`;
    const [results] = await DbInterface._rawExec(query, [identifier]);
    const profiles = <Profile[]>results;
    return profiles[0];
  }

  /**
   * Create a profile and associate it with the current player
   * @param identifier - player's identifier
   * @param profile - profile we are going to create
   * @returns Profile - the created profile
   */
  async createProfile(identifier: string, profile: NewProfile): Promise<Profile> {
    const { name, image, bio, location, job, tags, voiceMessage } = profile;
    const query = `
        INSERT INTO npwd_match_profiles (identifier, name, image, bio, location, job, tags, voiceMessage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`;

    await pool.execute(query, [identifier, name, image, bio, location, job, tags, voiceMessage]);
    return await this.getPlayerProfile(identifier);
  }

  /**
   * Update the current player's profile
   * @param identifier - player's identifier
   * @param profile Profile - player's updated profile
   */
  async updateProfile(identifier: string, profile: Profile): Promise<Profile> {
    const { image, name, bio, location, job, tags, voiceMessage } = profile;
    const query = `
        UPDATE npwd_match_profiles
        SET image    = ?,
            name     = ?,
            bio      = ?,
            location = ?,
            job      = ?,
            tags     = ?,
            voiceMessage = ?
        WHERE identifier = ?
		`;
    await pool.execute(query, [image, name, bio, location, job, tags, voiceMessage, identifier]);
    return await this.getPlayerProfile(identifier);
  }

  /**
   * Create a default profile for a player based on information
   * associated with them (name, phone number, etc.)
   * @param identifier - player's identifier
   * @returns Profile | null - the player's profile or null if it does not exist
   * and could not be created
   */
  async createDefaultProfile(identifier: string): Promise<Profile | null> {
    // case where the server owner wants players to select their own names
    if (!config.match.generateProfileNameFromUsers) return null;

    const defaultProfileName = await generateProfileName(identifier, ' ');
    // case where we tried to generate a profile name but failed due to
    // some database misconfiguration or error
    if (!defaultProfileName) return null;

    const defaultProfile: NewProfile = {
      name: defaultProfileName,
      image: DEFAULT_IMAGE,
      bio: '',
      location: '',
      job: '',
      tags: '',
      voiceMessage: null,
    };

    matchLogger.info(`Creating default match profile ${defaultProfileName} for ${identifier}`);
    return await this.createProfile(identifier, defaultProfile);
  }

  /**
   * Given a list of likes determine if any of the profiles we liked have also
   * liked us which indicates a match has occurred.
   * @param identifier - player's identifier
   * @param likes - list of new Likes
   * @returns Profile - list of profiles we matched with
   */
  async checkIfMatched(identifier: string, like: Like): Promise<Profile | null> {
    const matchedProfiles = await this.checkForMatchById(identifier, like.id);

    return matchedProfiles[0];
  }

  /**
   * Retrieve the player's profile by their identifier if it exists. If
   * not, create it and return it.
   * @param identifier - player's identifier
   * @returns Profile - player's profile
   */
  async getOrCreateProfile(identifier: string): Promise<Profile> {
    const profile = await this.getPlayerProfile(identifier);
    return profile || (await this.createDefaultProfile(identifier));
  }

  /**
   * We track when the player last used the app so other players can
   * be aware of how active that player is when they are liking/disliking
   * @param identifier - player's identifier
   */
  async updateLastActive(identifier: string): Promise<void> {
    const query = `
        UPDATE npwd_match_profiles
        SET updatedAt = CURRENT_TIMESTAMP()
        WHERE identifier = ?
		`;
    await pool.execute(query, [identifier]);
  }
}

export const MatchDB = new _MatchDB();
