import { pool } from './db';
import { getIdentifier, getSource } from './functions';
import { Profile } from '../../typings/match';
import events from '../utils/events';
import { mainLogger } from './sv_logger';
import { ResultSetHeader } from 'mysql2';

const matchLogger = mainLogger.child({ module: 'match' });

const me = 'd9733130fba5669192623b7c40580b3772b5955a';

async function getPotentialProfiles(identifier: string): Promise<Profile[]> {
  const query = `
  SELECT *,
  UNIX_TIMESTAMP(lastActive) AS lastActive
  FROM npwd_match_profiles
  WHERE identifier != ? AND lastActive >= NOW() - INTERVAL 7 DAY
  ORDER BY lastActive DESC
  LIMIT 25
  `;
  const [results] = await pool.query(query, [identifier]);
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
    console.log(profiles);
    emitNet(events.MATCH_GET_PROFILES_SUCCESS, source, profiles);
  } catch (e) {
    matchLogger.error(`Failed to retrieve profiles, ${e.message}`);
    emitNet(events.MATCH_GET_PROFILES_FAILED, source, {
      message: 'APPS_MATCH_GET_PROFILES_FAILED',
      type: 'error',
    });
  }
}

onNet(events.MATCH_INITIALIZE, async () => {
  const _source = getSource();
  const identifier = getIdentifier(_source);
  await dispatchPlayerProfile(identifier, _source);
  await dispatchProfiles(identifier, _source);
});
