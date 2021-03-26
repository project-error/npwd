import { ResultSetHeader } from 'mysql2';
import { pool } from './db';
import { getIdentifier, getSource } from './functions';
import { NewTweet, Tweet, Profile } from '../../typings/twitter';
import config from '../utils/config';
import { reportTweetToDiscord } from './discord';
import { mainLogger } from './sv_logger';
import { generateProfileName, getDefaultProfileNames } from './players/sv_players';
import { TwitterEvents } from '../../typings/twitter';

const twitterLogger = mainLogger.child({ module: 'twitter' });

interface ProfileName {
  profile_name: string;
}

const formatTweets = (profileId: number) => (tweet: Tweet): Tweet => ({
  ...tweet,
  isMine: tweet.profile_id === profileId,
  isRetweet: tweet.isRetweet === 1,
});

const SELECT_FIELDS = `
  npwd_twitter_tweets.id,
  npwd_twitter_tweets.identifier,
  npwd_twitter_profiles.id AS profile_id,
  npwd_twitter_profiles.profile_name,
  npwd_twitter_profiles.avatar_url,
  npwd_twitter_tweets.likes,
  npwd_twitter_tweets.visible,
  IFNULL(COALESCE(retweets.message, npwd_twitter_tweets.message), '') AS message,
  IFNULL(COALESCE(retweets.images, npwd_twitter_tweets.images), '') AS images,
  npwd_twitter_tweets.retweet IS NOT NULL AS isRetweet,
  retweets.id AS retweetId,
  retweets_profiles.profile_name AS retweetProfileName,
  retweets_profiles.avatar_url AS retweetAvatarUrl,
  npwd_twitter_likes.id IS NOT NULL AS isLiked,
  npwd_twitter_reports.id IS NOT NULL AS isReported,
  npwd_twitter_tweets.createdAt,
  npwd_twitter_tweets.updatedAt,
  TIME_TO_SEC(TIMEDIFF( NOW(), npwd_twitter_tweets.createdAt)) AS seconds_since_tweet
`;

/**
 * Retrieve the latest 100 tweets
 * @param profileId - twitter profile id of the player
 */
async function fetchAllTweets(profileId: number): Promise<Tweet[]> {
  const query = `
  SELECT
    ${SELECT_FIELDS}
  FROM npwd_twitter_tweets
  LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
  LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id  AND npwd_twitter_likes.profile_id = ?
  LEFT OUTER JOIN npwd_twitter_reports ON npwd_twitter_tweets.id = npwd_twitter_reports.tweet_id  AND npwd_twitter_reports.profile_id = ?
  LEFT OUTER JOIN npwd_twitter_tweets AS retweets ON retweets.id = npwd_twitter_tweets.retweet
  LEFT OUTER JOIN npwd_twitter_profiles AS retweets_profiles ON retweets.identifier = retweets_profiles.identifier
  WHERE  npwd_twitter_tweets.visible = 1
  ORDER BY npwd_twitter_tweets.createdAt DESC
  LIMIT 100
  `;
  const [results] = await pool.query(query, [profileId, profileId]);
  const tweets = <Tweet[]>results;
  return tweets.map(formatTweets(profileId));
}

/**
 * Fetch tweets by some search value submitted by the user. Intended to let
 * player's search for tweets by profile, message or more.
 * @param profileId - twitter profile id of the player
 * @param searchValue - value to search
 */
async function fetchTweetsFiltered(profileId: number, searchValue: string): Promise<Tweet[]> {
  const parameterizedSearchValue = `%${searchValue}%`;
  const query = `
    SELECT
      ${SELECT_FIELDS}
    FROM npwd_twitter_tweets
    LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
    LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id  AND npwd_twitter_likes.profile_id = ?
    LEFT OUTER JOIN npwd_twitter_reports ON npwd_twitter_tweets.id = npwd_twitter_reports.tweet_id  AND npwd_twitter_reports.profile_id = ?
    LEFT OUTER JOIN npwd_twitter_tweets AS retweets ON retweets.id = npwd_twitter_tweets.retweet
    LEFT OUTER JOIN npwd_twitter_profiles AS retweets_profiles ON retweets.identifier = retweets_profiles.identifier
    WHERE npwd_twitter_tweets.visible = 1 AND (npwd_twitter_profiles.profile_name LIKE ? OR npwd_twitter_tweets.message LIKE ?)
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
  return tweets.map(formatTweets(profileId));
}

/**
 * Retrieve a Tweet by ID
 * @param profileId Unique id for the twitter profile (NOT user identifier)
 * @param tweetId - primary key of the tweet ID
 */
async function getTweet(profileId: number, tweetId: number): Promise<Tweet> {
  const query = `
  SELECT
    ${SELECT_FIELDS}
  FROM npwd_twitter_tweets
  LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id  AND npwd_twitter_likes.profile_id = ?
  LEFT OUTER JOIN npwd_twitter_reports ON npwd_twitter_tweets.id = npwd_twitter_reports.tweet_id  AND npwd_twitter_reports.profile_id = ?
  LEFT OUTER JOIN npwd_twitter_tweets AS retweets ON retweets.id = npwd_twitter_tweets.retweet
  LEFT OUTER JOIN npwd_twitter_profiles AS retweets_profiles ON retweets.identifier = retweets_profiles.identifier
  LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
  WHERE npwd_twitter_tweets.id = ?
  `;
  const [results] = await pool.query(query, [profileId, profileId, tweetId]);
  const tweets = <Tweet[]>results;
  return tweets.map(formatTweets(profileId))[0];
}

/**
 * Creates a tweet in the database and then retrieves the tweet
 * @param identifier - player identifier
 * @param tweet - tweet to be created
 */
async function createTweet(identifier: string, tweet: NewTweet): Promise<Tweet> {
  const profile = await getProfile(identifier);
  const query = `
    INSERT INTO npwd_twitter_tweets (identifier, message, images, retweet)
    VALUES (?, ?, ?, ?)
    `;
  const [results] = await pool.query(query, [
    identifier,
    tweet.message,
    tweet.images,
    tweet.retweet,
  ]);
  // This should not be an any type and instead should be
  // a Tweet[] according to mysql2 documentation. But instead
  // this exec promise returns the row itself, not an array of rows like it states
  // Therefore type assertion doesn't work here for correctly typing this out.
  const insertData = <ResultSetHeader>results;
  return await getTweet(profile.id, insertData.insertId);
}

async function createTweetReport(tweetId: number, profileId: number): Promise<void> {
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
 * Create a twitter profile
 * @param identifier - player's identifier
 * @param profileName - profile name to be created
 * @returns
 */
async function createProfile(identifier: string, profileName: string): Promise<Profile> {
  const query = `
    INSERT INTO npwd_twitter_profiles (identifier, profile_name)
    VALUES (?, ?)
    `;

  await pool.execute(query, [identifier, profileName]);
  return await getProfile(identifier);
}

/**
 * Create a default twitter profile for a player. This is the intial profile
 * that all player's will receive and can then customize.
 * @param identifier - player's identifier
 */
async function createDefaultProfile(identifier: string): Promise<Profile | null> {
  // case where the server owner wants players to select their own names
  if (!config.twitter.generateProfileNameFromUsers) return null;

  const defaultProfileName = await generateProfileName(identifier);
  // case where we tried to generate a profile name but failed due to
  // some database misconfiguration or error
  if (!defaultProfileName) return null;

  twitterLogger.info(`Creating default Twitter profile ${defaultProfileName} for ${identifier}`);
  return await createProfile(identifier, defaultProfileName);
}

/**
 * Retrieve the player's profile by their identifier if it exists. If
 * not, create it and return it.
 * @param identifier - player's identifier
 */
export async function getOrCreateProfile(identifier: string): Promise<Profile> {
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
  await pool.execute(query, [avatar_url, profile_name, bio, location, job, identifier]);
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
  await pool.execute(query, [identifier, tweetId]);
}

/**
 * Check if a "like" relationship between a profile and a tweet exists
 * @param profileId - primary key of the profile to check
 * @param tweetId - primary key of the tweet to check
 */
async function doesLikeExist(profileId: number, tweetId: number): Promise<boolean> {
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
async function doesReportExist(tweetId: number, profileId: number): Promise<boolean> {
  const query = `
    SELECT * FROM npwd_twitter_reports
    WHERE tweet_id = ? AND profile_id = ?
    LIMIT 1
    `;
  const [results] = await pool.query(query, [tweetId, profileId]);
  const reports = <any[]>results;
  return reports.length > 0;
}

/**
 * Check to see if this player has already retweeted this tweet or
 * is the original poster of a retweeted tweet
 * @param tweetId - ID of the tweet in question
 * @param identifier - player identifier of the person performing the retweet
 */
async function doesRetweetExist(tweetId: number, identifier: string): Promise<boolean> {
  const query = `
  SELECT COUNT(id) as count
  FROM npwd_twitter_tweets
  WHERE (id = ? OR retweet = ?) AND identifier = ?
  `;
  const [results] = await pool.query(query, [tweetId, tweetId, identifier]);
  const counts = <any[]>results;
  return counts[0].count > 0;
}

onNet(TwitterEvents.GET_OR_CREATE_PROFILE, async () => {
  const _source = getSource();
  const identifier = getIdentifier(_source);

  try {
    const profile = await getOrCreateProfile(identifier);
    // if we got null from getOrCreateProfile it means it doesn't exist and
    // we failed to create it. In this case we pass the UI some default
    // profile names it can choose from
    if (!profile) {
      const defaultProfileNames = await getDefaultProfileNames(identifier);
      emitNet(TwitterEvents.GET_OR_CREATE_PROFILE_NULL, _source, defaultProfileNames);
    } else {
      emitNet(TwitterEvents.GET_OR_CREATE_PROFILE_SUCCESS, _source, profile);
    }
  } catch (e) {
    twitterLogger.error(`Failed to get or create profile, ${e.message}`, {
      source: _source,
    });
    emitNet(TwitterEvents.GET_OR_CREATE_PROFILE_FAILURE, _source);
  }
});

onNet(TwitterEvents.CREATE_PROFILE, async (profile: Profile) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    await createProfile(identifier, profile.profile_name);
    emitNet(TwitterEvents.CREATE_PROFILE_RESULT, _source, {
      message: 'TWITTER_CREATE_PROFILE_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    twitterLogger.error(`Failed to create twitter profile: ${e.message}`, {
      source: _source,
    });
    emitNet(TwitterEvents.CREATE_PROFILE_RESULT, _source, {
      message: 'TWITTER_CREATE_PROFILE_FAILURE',
      type: 'error',
    });
  }
});

onNet(TwitterEvents.UPDATE_PROFILE, async (profile: Profile) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    await updateProfile(identifier, profile);
    emitNet(TwitterEvents.UPDATE_PROFILE_RESULT, _source, {
      message: 'TWITTER_EDIT_PROFILE_SUCCESS',
      type: 'success',
    });
  } catch (e) {
    twitterLogger.error(`Failed to update twitter profile: ${e.message}`, {
      source: _source,
    });
    emitNet(TwitterEvents.UPDATE_PROFILE_RESULT, _source, {
      message: 'TWITTER_EDIT_PROFILE_FAILURE',
      type: 'error',
    });
  }
});

onNet(TwitterEvents.FETCH_TWEETS, async () => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const profile = await getProfile(identifier);
    if (!profile) {
      twitterLogger.warn(
        `Aborted fetching tweets for user ${identifier} because they do not have a profile.`,
      );
      return;
    }

    const tweets = await fetchAllTweets(profile.id);
    emitNet(TwitterEvents.FETCH_TWEETS_SUCCESS, _source, tweets);
  } catch (e) {
    twitterLogger.error(`Fetching tweets failed, ${e.message}`, {
      source: _source,
    });
    emitNet(TwitterEvents.FETCH_TWEETS_FAILURE, _source);
  }
});

onNet(TwitterEvents.FETCH_TWEETS_FILTERED, async (searchValue: string) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const profile = await getProfile(identifier);
    const tweets = await fetchTweetsFiltered(profile.id, searchValue);
    emitNet(TwitterEvents.FETCH_TWEETS_FILTERED_SUCCESS, _source, tweets);
  } catch (e) {
    twitterLogger.error(`Fetch filtered tweets failed, ${e.message}`, {
      source: _source,
    });
    emitNet(TwitterEvents.FETCH_TWEETS_FILTERED_FAILURE, _source);
  }
});

onNet(TwitterEvents.CREATE_TWEET, async (tweet: Tweet) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const createdTweet = await createTweet(identifier, tweet);
    emitNet(TwitterEvents.CREATE_TWEET_BROADCAST, -1, createdTweet);
  } catch (e) {
    twitterLogger.error(`Create tweet failed, ${e.message}`, {
      source: _source,
    });
    emitNet(TwitterEvents.CREATE_TWEET_RESULT, _source, {
      message: 'TWITTER_CREATE_FAILED',
      type: 'error',
    });
  }
});

onNet(TwitterEvents.DELETE_TWEET, async (tweetId: number) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    await deleteTweet(identifier, tweetId);

    emitNet(TwitterEvents.DELETE_TWEET_SUCCESS, _source);
  } catch (e) {
    twitterLogger.error(`Delete tweet failed, ${e.message}`, {
      source: _source,
    });
    emitNet(TwitterEvents.DELETE_TWEET_FAILURE, _source);
  }
});

onNet(TwitterEvents.TOGGLE_LIKE, async (tweetId: number) => {
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
    emitNet(TwitterEvents.TOGGLE_LIKE_SUCCESS, _source);
  } catch (e) {
    twitterLogger.error(`Like failed, ${e.message}`, {
      source: _source,
    });
    emitNet(TwitterEvents.TOGGLE_LIKE_FAILURE, _source);
  }
});

onNet(TwitterEvents.RETWEET, async (tweetId: number) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);

    // alert the player that they have already retweeted
    // this post (or that they are the original poster)
    if (await doesRetweetExist(tweetId, identifier)) {
      return emitNet(TwitterEvents.RETWEET_EXISTS, _source, {
        message: 'TWITTER_RETWEET_EXISTS',
        type: 'error',
      });
    }

    // our message for this row is blank because when we
    // query for this tweet it will join off of the retweet
    // column and fetch the message from the related tweet
    const retweet: NewTweet = { message: '', retweet: tweetId };
    const createdTweet = await createTweet(identifier, retweet);

    const profile = await getProfile(identifier);
    const tweet = await getTweet(profile.id, createdTweet.id);
    emitNet(TwitterEvents.CREATE_TWEET_BROADCAST, -1, tweet);
  } catch (e) {
    twitterLogger.error(`Retweet failed, ${e.message}`, {
      source: _source,
    });
    emitNet(TwitterEvents.RETWEET_FAILURE, _source);
  }
});

onNet(TwitterEvents.REPORT, async (tweetId: number) => {
  const _source = getSource();
  try {
    const identifier = getIdentifier(_source);
    const profile = await getProfile(identifier);
    const tweet = await getTweet(profile.id, tweetId);

    const reportExists = await doesReportExist(tweet.id, profile.id);

    if (reportExists) {
      return twitterLogger.warn('This profile has already reported this tweet');
    }

    await createTweetReport(tweet.id, profile.id);
    await reportTweetToDiscord(tweet, profile);

    emitNet(TwitterEvents.REPORT_SUCCESS, _source);
  } catch (e) {
    emitNet(TwitterEvents.REPORT_FAILURE, _source);
    twitterLogger.error(`Twitter report failed, ${e.message}`, {
      source: _source,
    });
  }
});

if (!config.twitter.allowEdtiableProfileName && !config.twitter.generateProfileNameFromUsers) {
  const warning =
    `Both allowEdtiableProfileName and generateProfileNameFromUsers ` +
    `are set false - this means users will likely not have profile names ` +
    `for the Twitter App and won't be able to use it!`;
  twitterLogger.warn(warning);
}
