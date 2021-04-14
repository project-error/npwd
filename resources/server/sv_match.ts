import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { pool } from './db';
import { getIdentifier, getSource } from './functions';
import { config } from './server';
import { Like, Match, Profile, MatchEvents, NewProfile } from '../../typings/match';
import { mainLogger } from './sv_logger';
import { generateProfileName } from './players/sv_players';

const matchLogger = mainLogger.child({ module: 'match' });
const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

/**
 * Select profiles that:
 * 1. aren't the current player
 * 2. haven't been viewed before
 * 3. have been viewed before but that was at least 7 days ago
 * @param identifier - players identifier
 * @returns - array of profiles
 */
async function getPotentialProfiles(identifier: string): Promise<Profile[]> {
  const query = `
    SELECT
    npwd_match_profiles.*,
    UNIX_TIMESTAMP(npwd_match_profiles.updatedAt) AS lastActive,
    MaxDates.lastSeen
    FROM npwd_match_profiles 
    LEFT OUTER JOIN (
        SELECT id, profile, MAX(createdAt) AS lastSeen
        FROM npwd_match_views
        WHERE identifier = ?
        GROUP BY id, profile
    ) AS MaxDates ON npwd_match_profiles.id = MaxDates.profile
    WHERE npwd_match_profiles.identifier != ? AND
        (MaxDates.lastSeen IS NULL OR MaxDates.lastSeen < NOW() - INTERVAL 7 DAY)
    ORDER BY npwd_match_profiles.updatedAt DESC
    LIMIT 25
  `;
  const [results] = await pool.query(query, [identifier, identifier]);
  const profiles = <Profile[]>results;
  return profiles;
}

/**
 * Save a list of Like objects
 * @param identifier - player's identifier
 * @param likes - likes to be saved to the database
 * @returns ResultSet
 */
async function saveLikes(identifier: string, likes: Like[]): Promise<ResultSetHeader[]> {
  const query = `INSERT INTO npwd_match_views (identifier, profile, liked) VALUES ?`;
  const formattedLikes = likes.map((like) => [identifier, like.id, like.liked]);

  const results = await pool.query(query, [formattedLikes]);
  const result = <ResultSetHeader[]>results;
  return result;
}

/**
 * Determines if a profile we just liked has already liked us in the past which
 * indicates a match has occurred
 * @param identifier - player's identifier
 * @param id - profile ID we just liked
 * @returns Profile[] - list of profiles that are a match
 */
async function checkForMatchById(identifier: string, id: number): Promise<Profile[]> {
  const query = `
    SELECT
        targetProfile.*,
        UNIX_TIMESTAMP(targetProfile.updatedAt) AS lastActive
    FROM npwd_match_views
    LEFT OUTER JOIN npwd_match_profiles AS playerProfile ON npwd_match_views.profile = playerProfile.id
    LEFT OUTER JOIN npwd_match_profiles AS targetProfile ON npwd_match_views.identifier = targetProfile.identifier
    WHERE playerProfile.identifier = ? AND targetProfile.id = ?  AND Liked = 1
    `;
  const [results] = await pool.query(query, [identifier, id]);
  return <Profile[]>results;
}

/**
 * Given a list of likes determine if any of the profiles we liked have also
 * liked us which indicates a match has occurred.
 * @param identifier - player's identifier
 * @param likes - list of new Likes
 * @returns Profile[] - list of profiles we matched with
 */
async function findNewMatches(identifier: string, likes: Like[]): Promise<Profile[]> {
  let matches: Profile[] = [];
  for (const like of likes) {
    if (!like.liked) continue;
    const matchedProfiles = await checkForMatchById(identifier, like.id);
    matches = matches.concat(matchedProfiles);
  }
  return matches;
}

/**
 * Return all matches associated with a player regardless of date/time. A
 * match is a case where two profiles have liked each other.
 * @param identifier - player's identifier
 * @returns Match[] - all matches associated with the current player
 */
async function findAllMatches(identifier: string): Promise<Match[]> {
  const query = `
  SELECT
    targetProfile.*,
    UNIX_TIMESTAMP(targetProfile.updatedAt) AS lastActive,
    UNIX_TIMESTAMP(GREATEST(npwd_match_views.createdAt, targetViews.createdAt)) AS matchedAt,
    targetUser.phone_number AS phoneNumber
  FROM npwd_match_views
  LEFT OUTER JOIN npwd_match_profiles AS targetProfile ON npwd_match_views.profile = targetProfile.id
  LEFT OUTER JOIN npwd_match_profiles AS myProfile ON npwd_match_views.identifier = myProfile.identifier
  LEFT OUTER JOIN npwd_match_views AS targetViews ON targetProfile.identifier = targetViews.identifier AND targetViews.profile = myProfile.id
  LEFT OUTER JOIN users AS targetUser ON targetProfile.identifier = targetUser.identifier
  WHERE npwd_match_views.identifier = ? AND npwd_match_views.liked = 1 AND targetViews.liked = 1 
  ORDER BY matchedAt DESC
    `;
  const [results] = await pool.query(query, [identifier]);
  return <Match[]>results;
}

/**
 * Retrieve the current player's profile
 * @param identifier - player's identifier
 * @returns Profile - player's current profile
 */
async function getPlayerProfile(identifier: string): Promise<Profile> {
  const query = `
    SELECT *,
    UNIX_TIMESTAMP(updatedAt) AS lastActive
    FROM npwd_match_profiles
    WHERE identifier = ?
    LIMIT 1
    `;
  const [results] = await pool.query(query, [identifier]);
  const profiles = <Profile[]>results;
  return profiles[0];
}

/**
 * Create a profile and associate it with the current player
 * @param identifier - player's identifier
 * @param profile - profile we are going to create
 * @returns Profile - the created profile
 */
async function createProfile(identifier: string, profile: NewProfile): Promise<Profile> {
  const { name, image, bio, location, job, tags } = profile;
  const query = `
    INSERT INTO npwd_match_profiles (identifier, name, image, bio, location, job, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  await pool.execute(query, [identifier, name, image, bio, location, job, tags]);
  return await getPlayerProfile(identifier);
}

/**
 * Update the current player's profile
 * @param identifier - player's identifier
 * @param profile Profile - player's updated profile
 */
async function updateProfile(identifier: string, profile: Profile): Promise<Profile> {
  const { image, name, bio, location, job, tags } = profile;
  const query = `
      UPDATE npwd_match_profiles
      SET image = ?, name = ?, bio = ?, location = ?, job = ?, tags = ?
      WHERE identifier = ?
      `;
  await pool.execute(query, [image, name, bio, location, job, tags, identifier]);
  return await getPlayerProfile(identifier);
}

/**
 * Create a default profile for a player based on information
 * associated with them (name, phone number, etc.)
 * @param identifier - player's identifier
 * @returns Profile | null - the player's profile or null if it does not exist
 * and could not be created
 */
async function createDefaultProfile(identifier: string): Promise<Profile | null> {
  // case where the server owner wants players to select their own names
  if (!config.match.generateProfileNameFromUsers) return null;

  const defaultProfileName = await generateProfileName(identifier, ' ');
  // case where we tried to generate a profile name but failed due to
  // some database misconfiguration or error
  if (!defaultProfileName) return null;

  const defaultProfile = {
    name: defaultProfileName,
    image: DEFAULT_IMAGE,
    bio: '',
    location: '',
    job: '',
    tags: '',
  };

  matchLogger.info(`Creating default match profile ${defaultProfileName} for ${identifier}`);
  return await createProfile(identifier, defaultProfile);
}

/**
 * Retrieve the player's profile by their identifier if it exists. If
 * not, create it and return it.
 * @param identifier - player's identifier
 * @returns Profile - player's profile
 */
export async function getOrCreateProfile(identifier: string): Promise<Profile> {
  const profile = await getPlayerProfile(identifier);
  return profile || (await createDefaultProfile(identifier));
}

/**
 * We track when the player last used the app so other players can
 * be aware of how active that player is when they are liking/disliking
 * @param identifier - player's identifier
 */
async function updateLastActive(identifier: string): Promise<void> {
  const query = `
    UPDATE npwd_match_profiles
    SET updatedAt = CURRENT_TIMESTAMP()
    WHERE identifier = ?
  `;
  await pool.execute(query, [identifier]);
}

async function dispatchPlayerProfile(identifier: string, source: number): Promise<void> {
  try {
    const profile = await getOrCreateProfile(identifier);
    emitNet(MatchEvents.GET_MY_PROFILE_SUCCESS, source, profile);
  } catch (e) {
    matchLogger.error(`Failed to get player profile, ${e.message}`);
    emitNet(MatchEvents.GET_MY_PROFILE_FAILED, source, {
      message: 'APPS_MATCH_GET_MY_PROFILE_FAILED',
      type: 'error',
    });
  }
}

async function dispatchProfiles(identifier: string, source: number): Promise<void> {
  try {
    const profiles = await getPotentialProfiles(identifier);
    emitNet(MatchEvents.GET_PROFILES_SUCCESS, source, profiles);
  } catch (e) {
    matchLogger.error(`Failed to retrieve profiles, ${e.message}`);
    emitNet(MatchEvents.GET_PROFILES_FAILED, source, {
      message: 'APPS_MATCH_GET_PROFILES_FAILED',
      type: 'error',
    });
  }
}

onNet(MatchEvents.INITIALIZE, async () => {
  const _source = getSource();
  const identifier = getIdentifier(_source);
  matchLogger.debug(`Initializing match for identifier: ${identifier}`);

  await dispatchPlayerProfile(identifier, _source);
  await dispatchProfiles(identifier, _source);
  await updateLastActive(identifier);
});

onNet(MatchEvents.CREATE_MY_PROFILE, async (profile: Profile) => {
  const _source = getSource();
  const identifier = getIdentifier(_source);
  matchLogger.debug(`Creating profile for identifier: ${identifier}`);
  matchLogger.debug(profile);

  try {
    if (!profile.name || !profile.name.trim()) {
      throw new Error('Profile name must not be blank');
    }

    const newProfile = await createProfile(identifier, profile);
    emitNet(MatchEvents.CREATE_MY_PROFILE_SUCCESS, _source, newProfile);
  } catch (e) {
    matchLogger.error(`Failed to update profile for identifier ${identifier}, ${e.message}`);
    emitNet(MatchEvents.CREATE_MY_PROFILE_FAILED, _source, {
      message: 'APPS_MATCH_CREATE_PROFILE_FAILED',
      type: 'error',
    });
  }
});

onNet(MatchEvents.UPDATE_MY_PROFILE, async (profile: Profile) => {
  const _source = getSource();
  const identifier = getIdentifier(_source);
  matchLogger.debug(`Updating profile for identifier: ${identifier}`);
  matchLogger.debug(profile);

  try {
    if (!profile.name || !profile.name.trim()) {
      throw new Error('Profile name must not be blank');
    }

    const updatedProfile = await updateProfile(identifier, profile);
    emitNet(MatchEvents.UPDATE_MY_PROFILE_SUCCESS, _source, updatedProfile);
  } catch (e) {
    matchLogger.error(`Failed to update profile for identifier ${identifier}, ${e.message}`);
    emitNet(MatchEvents.UPDATE_MY_PROFILE_FAILED, _source, {
      message: 'APPS_MATCH_UPDATE_PROFILE_FAILED',
      type: 'error',
    });
  }
});

onNet(MatchEvents.SAVE_LIKES, async (likes: Like[]) => {
  const _source = getSource();
  const identifier = getIdentifier(_source);
  matchLogger.debug(`Saving likes for identifier ${identifier}`);

  try {
    await saveLikes(identifier, likes);
  } catch (e) {
    matchLogger.error(`Failed to save likes, ${e.message}`);
    emitNet(MatchEvents.SAVE_LIKES_FAILED, _source, {
      message: 'APPS_MATCH_SAVE_LIKES_FAILED',
      type: 'error',
    });
  }

  try {
    const newMatches = await findNewMatches(identifier, likes);
    if (newMatches.length > 0) {
      emitNet(MatchEvents.NEW_MATCH, _source, {
        message: 'APPS_MATCH_NEW_LIKE_FOUND',
        type: 'info',
      });
    }
  } catch (e) {
    matchLogger.error(`Failed to find new matches, ${e.message}`);
  }
});

onNet(MatchEvents.GET_MATCHES, async () => {
  const _source = getSource();
  const identifier = getIdentifier(_source);

  try {
    const matchedProfiles = await findAllMatches(identifier);
    emitNet(MatchEvents.GET_MATCHES_SUCCESS, _source, matchedProfiles);
  } catch (e) {
    matchLogger.error(`Failed to retrieve matches, ${e.message}`);
    emitNet(MatchEvents.GET_MATCHES_FAILED, _source, {
      message: 'APPS_MATCH_GET_MATCHES_FAILED',
      type: 'error',
    });
  }
});

if (!config.match.allowEditableProfileName && !config.match.generateProfileNameFromUsers) {
  const warning =
    `Both allowEdtiableProfileName and generateProfileNameFromUsers ` +
    `are set false - this means users will likely not have profile names ` +
    `for the Match App and won't be able to use it!`;
  matchLogger.warn(warning);
}
