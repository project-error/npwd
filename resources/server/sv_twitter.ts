import { pool } from './db';
import { ESX } from './server';
import { getIdentifier, getSource } from './functions';
import { Tweet, Profile } from '../../phone/src/common/typings/twitter';
import events from '../utils/events';
import config from '../utils/config';
import { reportTweetToDiscord } from './discord';
import { mainLogger } from './sv_logger';

const twitterLogger = mainLogger.child({ module: 'twitter' });

interface ProfileName {
  profile_name: string;
}

/**
 * Retrieve the latest 100 tweets
 * @param profileId - twitter profile id of the player
 */
async function fetchAllTweets(profileId: number): Promise<Tweet[]> {
  const query = `
    SELECT
      npwd_twitter_profiles.id AS profile_id,
      npwd_twitter_profiles.profile_name,
      npwd_twitter_profiles.avatar_url,
      npwd_twitter_tweets.*,
      npwd_twitter_likes.id IS NOT NULL AS isLiked,
      npwd_twitter_reports.id IS NOT NULL AS isReported,
      TIME_TO_SEC(TIMEDIFF( NOW(), npwd_twitter_tweets.createdAt)) AS seconds_since_tweet
    FROM npwd_twitter_tweets
    LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
    LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id  AND npwd_twitter_likes.profile_id = ?
    LEFT OUTER JOIN npwd_twitter_reports ON npwd_twitter_tweets.id = npwd_twitter_reports.tweet_id  AND npwd_twitter_reports.profile_id = ?
    WHERE visible = 1
    ORDER BY npwd_twitter_tweets.createdAt DESC 
    LIMIT 100
    `;
  const [results] = await pool.query(query, [profileId, profileId]);
  const tweets = <Tweet[]>results;
  return tweets.map((tweet) => ({
    ...tweet,
    isMine: tweet.profile_id === profileId,
  }));
}

/**
 * Fetch tweets by some search value submitted by the user. Intended to let
 * player's search for tweets by profile, message or more.
 * @param profileId - twitter profile id of the player
 * @param searchValue - value to search
 */
async function fetchTweetsFiltered(
  profileId: number,
  searchValue: string
): Promise<Tweet[]> {
  const parameterizedSearchValue = `%${searchValue}%`;
  const query = `
    SELECT
      npwd_twitter_profiles.id AS profile_id,
      npwd_twitter_profiles.profile_name,
      npwd_twitter_profiles.avatar_url,
      npwd_twitter_tweets.*,
      npwd_twitter_likes.id IS NOT NULL AS isLiked,
      npwd_twitter_reports.id IS NOT NULL AS isReported,
      TIME_TO_SEC(TIMEDIFF( NOW(), npwd_twitter_tweets.createdAt)) AS seconds_since_tweet
    FROM npwd_twitter_tweets
    LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
    LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id  AND npwd_twitter_likes.profile_id = ?
    LEFT OUTER JOIN npwd_twitter_reports ON npwd_twitter_tweets.id = npwd_twitter_reports.tweet_id  AND npwd_twitter_reports.profile_id = ?
    WHERE visible = 1 AND (npwd_twitter_profiles.profile_name LIKE ? OR npwd_twitter_tweets.message LIKE ?)
    ORDER BY npwd_twitter_tweets.createdAt DESC 
    LIMIT 100
    `;
  const [results] = await pool.query(query, [
    profileId,
    profileId,
    parameterizedSearchValue,
    parameterizedSearchValue,
  ]);
  const tweets = <Tweet[]>results;
  return tweets.map((tweet) => ({
    ...tweet,
    isMine: tweet.profile_id === profileId,
  }));
}

/**
 * Retrieve a Tweet by ID
 * @param tweetId - primary key of the tweet ID
 */
async function getTweet(profileId: number, tweetId: number): Promise<Tweet> {
  const query = `
  SELECT
    npwd_twitter_profiles.id AS profile_id,
    npwd_twitter_profiles.profile_name,
    npwd_twitter_profiles.avatar_url,
    npwd_twitter_tweets.* 
  FROM npwd_twitter_tweets
  LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
  WHERE npwd_twitter_tweets.id = ?
  `;
  const [results] = await pool.query(query, [tweetId]);
  const tweets = <Tweet[]>results;
  const tweet = tweets[0];
  return { ...tweet, isMine: tweet.profile_id === profileId };
}

/**
 * Creates a tweet in the database and then retrieves the tweet
 * @param identifier - player identifier
 * @param tweet - tweet to be created
 */
async function createTweet(identifier: string, tweet: Tweet): Promise<Tweet> {
  const profile = await getProfile(identifier);
  const query = `
    INSERT INTO npwd_twitter_tweets (identifier, message, images)
    VALUES (?, ?, ?)
    `;
  const [results] = await pool.query(query, [
    identifier,
    tweet.message,
    tweet.images,
  ]);
  const insertData = <any>results;
  return await getTweet(profile.id, insertData.insertId);
}

async function createTweetReport(
  tweetId: number,
  profileId: number
): Promise<void> {
  const query = `
    INSERT INTO npwd_twitter_reports (tweet_id, profile_id)
    VALUES (?, ?)
    `;
  await pool.execute(query, [tweetId, profileId]);
}

/**
 * Retrieve a player's twitter profile by their identifier
 * @param identifier - player identifier
 */
async function getProfile(identifier: string): Promise<Profile | null> {
  const query = `
    SELECT * FROM npwd_twitter_profiles
    WHERE identifier = ?
    LIMIT 1
    `;
  const [results] = await pool.query(query, [identifier]);
  const profiles = <Profile[]>results;
  return profiles.length > 0 ? profiles[0] : null;
}

/**
 * Generate a twitter profile name by the player's name
 * @param identifier - player's identifier
 */
async function generateProfileName(identifier: string): Promise<string> {
  const defaultProfileName = '';
  if (!config.twitter.generateProfileNameFromUsers) return defaultProfileName;

  const query = `
    SELECT CONCAT(firstname, '_', lastname) AS profile_name
    FROM users
    WHERE identifier = ? LIMIT 1
    `;
  const [results] = await pool.query(query, [identifier]);
  const profileNames = <ProfileName[]>results;

  if (profileNames.length === 0) return defaultProfileName;
  return profileNames[0].profile_name || defaultProfileName;
}

/**
 * Create a default twitter profile for a player. This is the intial profile
 * that all player's will receive and can then customize.
 * @param identifier - player's identifier
 */
async function createDefaultProfile(identifier: string): Promise<Profile> {
  const profileName = await generateProfileName(identifier);
  const query = `
    INSERT INTO npwd_twitter_profiles (identifier, profile_name)
    VALUES (?, ?)
    `;
  const [result] = await pool.execute(query, [identifier, profileName]);
  return getProfile(identifier);
}

/**
 * Retrieve the player's profile by their identifier if it exists. If
 * not, create it and return it.
 * @param identifier - player's identifier
 */
async function getOrCreateProfile(identifier: string): Promise<Profile> {
  const profile = await getProfile(identifier);
  return profile || (await createDefaultProfile(identifier));
}

async function updateProfile(identifier: string, profile: Profile) {
  const { avatar_url, profile_name, bio, location, job } = profile;
  const query = `
    UPDATE npwd_twitter_profiles
    SET avatar_url = ?, profile_name = ?, bio = ?, location = ?, job = ?
    WHERE identifier = ?
    `;
  await pool.execute(query, [
    avatar_url,
    profile_name,
    bio,
    location,
    job,
    identifier,
  ]);
}

/**
 * Create a "like" in the database that ties a profile & tweet together
 * @param profileId - primary key of the profile conducting the like
 * @param tweetId - primary key of the tweet being liked
 */
async function createLike(profileId: number, tweetId: number): Promise<void> {
  const query = `
    INSERT INTO npwd_twitter_likes (profile_id, tweet_id)
    VALUES (?, ?)
    `;
  await pool.execute(query, [profileId, tweetId]);
}

/**
 * Delete a "like" relationship from the database
 * @param profileId - primary key of the profile removing the like
 * @param tweetId - primary key of the tweet to remove the like from
 */
async function deleteLike(profileId: number, tweetId: number): Promise<void> {
  const query = `
    DELETE FROM npwd_twitter_likes
    WHERE profile_id = ? AND tweet_id = ?
    `;
  await pool.execute(query, [profileId, tweetId]);
}

/**
 * Delete a tweet from the database
 * @param identifier - identifier of the source user
 * @param tweetId - primary key of the tweet to remove the like from
 */
async function deleteTweet(identifier: string, tweetId: number): Promise<void> {
  if (!config.twitter.allowDeleteTweets) return;

  const query = `
    DELETE FROM npwd_twitter_tweets
    WHERE identifier = ? AND id = ?
  `;
  const [result] = await pool.execute(query, [identifier, tweetId]);
}

/**
 * Check if a "like" relationship between a profile and a tweet exists
 * @param profileId - primary key of the profile to check
 * @param tweetId - primary key of the tweet to check
 */
async function doesLikeExist(
  profileId: number,
  tweetId: number
): Promise<boolean> {
  const query = `
    SELECT * FROM npwd_twitter_likes
    WHERE profile_id = ? AND tweet_id = ?
    LIMIT 1
    `;
  const [results] = await pool.query(query, [profileId, tweetId]);
  const likes = <any[]>results;
  return likes.length > 0;
}

/**
 * Check if a tweet has been reported by this profile already
 * @param tweetId - primary key of the tweet to check
 * @param profileId - primary key of the profile to check
 */
async function doesReportExist(
  tweetId: number,
  profileId: number
): Promise<boolean> {
  const query = `
    SELECT * FROM npwd_twitter_reports
    WHERE tweet_id = ? AND profile_id = ?
    LIMIT 1
    `;
  const [results] = await pool.query(query, [tweetId, profileId]);
  const reports = <any[]>results;
  return reports.length > 0;
}

onNet(events.TWITTER_GET_OR_CREATE_PROFILE, async () => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const profile = await getOrCreateProfile(identifier);
    emitNet(events.TWITTER_GET_OR_CREATE_PROFILE_SUCCESS, _source, profile);
  } catch (e) {
    twitterLogger.error(`Failed to get or create profile, ${e.message}`, {
      source: _source,
    });
    emitNet(events.TWITTER_GET_OR_CREATE_PROFILE_FAILURE, _source);
  }
});

onNet(events.TWITTER_UPDATE_PROFILE, async (profile: Profile) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    await updateProfile(identifier, profile);
    emitNet(events.TWITTER_UPDATE_PROFILE_RESULT, _source, true);
  } catch (e) {
    twitterLogger.error(`Failed to update twitter profile: ${e.message}`, {
      source: _source,
    });
    emitNet(events.TWITTER_UPDATE_PROFILE_RESULT, _source, false);
  }
});

onNet(events.TWITTER_FETCH_TWEETS, async () => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const profile = await getProfile(identifier);
    const tweets = await fetchAllTweets(profile.id);
    emitNet(events.TWITTER_FETCH_TWEETS_SUCCESS, _source, tweets);
  } catch (e) {
    twitterLogger.error(`Fetching tweets failed, ${e.message}`, {
      source: _source,
    });
    emitNet(events.TWITTER_FETCH_TWEETS_FAILURE, _source);
  }
});

onNet(events.TWITTER_FETCH_TWEETS_FILTERED, async (searchValue: string) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const profile = await getProfile(identifier);
    const tweets = await fetchTweetsFiltered(profile.id, searchValue);
    emitNet(events.TWITTER_FETCH_TWEETS_FILTERED_SUCCESS, _source, tweets);
  } catch (e) {
    twitterLogger.error(`Fetch filtered tweets failed, ${e.message}`, {
      source: _source,
    });
    emitNet(events.TWITTER_FETCH_TWEETS_FILTERED_FAILURE, _source);
  }
});

onNet(events.TWITTER_CREATE_TWEET, async (tweet: Tweet) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const createdTweet = await createTweet(identifier, tweet);

    emitNet(events.TWITTER_CREATE_TWEET_RESULT, _source, true);
    emitNet(events.TWITTER_CREATE_TWEET_BROADCAST, -1, createdTweet);
  } catch (e) {
    twitterLogger.error(`Create tweet failed, ${e.message}`, {
      source: _source,
    });
    emitNet(events.TWITTER_CREATE_TWEET_RESULT, _source, false);
  }
});

onNet(events.TWITTER_DELETE_TWEET, async (tweetId: number) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    await deleteTweet(identifier, tweetId);

    emitNet(events.TWITTER_DELETE_TWEET_SUCCESS, _source);
  } catch (e) {
    twitterLogger.error(`Delete tweet failed, ${e.message}`, {
      source: _source,
    });
    emitNet(events.TWITTER_DELETE_TWEET_FAILURE, _source);
  }
});

onNet(events.TWITTER_TOGGLE_LIKE, async (tweetId: number) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const profile = await getOrCreateProfile(identifier);
    const likeExists = await doesLikeExist(profile.id, tweetId);
    if (likeExists) {
      await deleteLike(profile.id, tweetId);
    } else {
      await createLike(profile.id, tweetId);
    }
    emitNet(events.TWITTER_TOGGLE_LIKE_SUCCESS, _source);
  } catch (e) {
    twitterLogger.error(`Like failed, ${e.message}`, {
      source: _source,
    });
    emitNet(events.TWITTER_TOGGLE_LIKE_FAILURE, _source);
  }
});

onNet(events.TWITTER_REPORT, async (tweetId: number) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const profile = await getProfile(identifier);
    const tweet = await getTweet(profile.id, tweetId);

    const reportExists = await doesReportExist(tweet.id, profile.id);
    if (reportExists) {
      twitterLogger.warn('This profile has already reported this tweet');
    } else {
      await createTweetReport(tweet.id, profile.id);
      await reportTweetToDiscord(tweet, profile);
    }

    emitNet(events.TWITTER_REPORT_SUCCESS, _source);
  } catch (e) {
    emitNet(events.TWITTER_REPORT_FAILURE, _source);
    twitterLogger.error(`Twitter report failed, ${e.message}`, {
      source: _source,
    });
  }
});
