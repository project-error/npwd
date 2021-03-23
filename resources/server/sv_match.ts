import { pool } from './db';
import { getIdentifier, getSource } from './functions';
import { Like, Match, Profile } from '../../typings/match';
import events from '../utils/events';
import { mainLogger } from './sv_logger';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const matchLogger = mainLogger.child({ module: 'match' });

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
    UNIX_TIMESTAMP(npwd_match_profiles.lastActive) AS lastActive,
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
    ORDER BY npwd_match_profiles.lastActive DESC
    LIMIT 25
  `;
  const [results] = await pool.query(query, [identifier, identifier]);
  const profiles = <Profile[]>results;
  return profiles;
}

async function getPlayerProfile(identifier: string): Promise<Profile> {
  const query = `
    SELECT *,
    UNIX_TIMESTAMP(lastActive) AS lastActive
    FROM npwd_match_profiles
    WHERE identifier = ?
    LIMIT 1
    `;
  const [results] = await pool.query(query, [identifier]);
  const profiles = <Profile[]>results;
  return profiles[0];
}

async function getPlayerProfileId(identifier: string): Promise<number> {
  const query = `SELECT id npwd_match_profiles WHERE identifier = ?`;
  const [results] = await pool.query(query, [identifier]);
  const ids = <RowDataPacket>results;
  return ids[0];
}

async function getIdentifierFromProfileId(id: number): Promise<string> {
  const query = `SELECT identifier npwd_match_profiles WHERE id = ?`;
  const [results] = await pool.query(query, [id]);
  const identifiers = <RowDataPacket>results;
  return identifiers[0];
}

async function dispatchPlayerProfile(identifier: string, source: number): Promise<void> {
  try {
    const profile = await getPlayerProfile(identifier);
    emitNet(events.MATCH_GET_MY_PROFILE_SUCCESS, source, profile);
  } catch (e) {
    matchLogger.error(`Failed to get player profile, ${e.message}`);
    emitNet(events.MATCH_GET_MY_PROFILE_FAILED, source, {
      message: 'APPS_MATCH_GET_MY_PROFILE_FAILED',
      type: 'error',
    });
  }
}

async function dispatchProfiles(identifier: string, source: number): Promise<void> {
  try {
    const profiles = await getPotentialProfiles(identifier);
    emitNet(events.MATCH_GET_PROFILES_SUCCESS, source, profiles);
  } catch (e) {
    matchLogger.error(`Failed to retrieve profiles, ${e.message}`);
    emitNet(events.MATCH_GET_PROFILES_FAILED, source, {
      message: 'APPS_MATCH_GET_PROFILES_FAILED',
      type: 'error',
    });
  }
}

async function saveLikes(identifier: string, likes: Like[]): Promise<ResultSetHeader[]> {
  const query = `INSERT INTO npwd_match_views (identifier, profile, liked) VALUES ?`;
  const formattedLikes = likes.map((like) => [identifier, like.id, like.liked]);

  const results = await pool.query(query, [formattedLikes]);
  const result = <ResultSetHeader[]>results;
  return result;
}

async function checkForMatchById(identifier: string, id: number): Promise<Profile[]> {
  const query = `
    SELECT
        targetProfile.*,
        UNIX_TIMESTAMP(targetProfile.lastActive) AS lastActive
    FROM npwd_match_views
    LEFT OUTER JOIN npwd_match_profiles AS playerProfile ON npwd_match_views.profile = playerProfile.id
    LEFT OUTER JOIN npwd_match_profiles AS targetProfile ON npwd_match_views.identifier = targetProfile.identifier
    WHERE playerProfile.identifier = ? AND targetProfile.id = ?  AND Liked = 1
    `;
  const [results] = await pool.query(query, [identifier, id]);
  return <Profile[]>results;
}

/**
 * @param identifier
 * @param likes
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

async function findAllMatches(identifier: string): Promise<Match[]> {
  const query = `
    SELECT
        targetProfile.*,
        UNIX_TIMESTAMP(targetProfile.lastActive) AS lastActive,
        UNIX_TIMESTAMP(GREATEST(npwd_match_views.createdAt, targetViews.createdAt)) AS matchedAt
    FROM npwd_match_views
    LEFT OUTER JOIN npwd_match_profiles AS targetProfile ON npwd_match_views.profile = targetProfile.id
    LEFT OUTER JOIN npwd_match_profiles AS myProfile ON npwd_match_views.identifier = myProfile.identifier
    LEFT OUTER JOIN npwd_match_views AS targetViews ON targetProfile.identifier = targetViews.identifier AND targetViews.profile = myProfile.id
    WHERE npwd_match_views.identifier = ? AND npwd_match_views.liked = 1 AND targetViews.liked = 1 
    `;
  const [results] = await pool.query(query, [identifier]);
  return <Match[]>results;
}

onNet(events.MATCH_INITIALIZE, async () => {
  const _source = getSource();
  const identifier = getIdentifier(_source);
  await dispatchPlayerProfile(identifier, _source);
  await dispatchProfiles(identifier, _source);
});

onNet(events.MATCH_SAVE_LIKES, async (likes: Like[]) => {
  const _source = getSource();
  const identifier = getIdentifier(_source);
  matchLogger.info(`Saving likes for identifier ${identifier}`);

  try {
    await saveLikes(identifier, likes);
  } catch (e) {
    matchLogger.error(`Failed to save likes, ${e.message}`);
    emitNet(events.MATCH_SAVE_LIKES_FAILED, _source, {
      message: 'APPS_MATCH_SAVE_LIKES_FAILED',
      type: 'error',
    });
  }

  try {
    const newMatches = await findNewMatches(identifier, likes);
    console.log(newMatches);
    if (newMatches.length > 0) {
      emitNet(events.MATCH_NEW_MATCH, _source, {
        message: 'APPS_MATCH_NEW_LIKE_FOUND',
        type: 'info',
      });
    }
  } catch (e) {
    matchLogger.error(`Failed to find new matches, ${e.message}`);
  }
});

onNet(events.MATCH_GET_MATCHES, async () => {
  const _source = getSource();
  const identifier = getIdentifier(_source);

  try {
    const matchedProfiles = await findAllMatches(identifier);
    emitNet(events.MATCH_GET_MATCHES_SUCCESS, _source, matchedProfiles);
  } catch (e) {
    matchLogger.error(`Failed to retrieve matches, ${e.message}`);
    emitNet(events.MATCH_GET_MATCHES_FAILED, _source, {
      message: 'APPS_MATCH_GET_MATCHES_FAILED',
      type: 'error',
    });
  }
});
