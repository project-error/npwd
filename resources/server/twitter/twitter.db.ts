import { NewTweet, Profile, Tweet } from '../../../typings/twitter';
import { pool } from '../db/pool';
import { ResultSetHeader } from 'mysql2';
import { config } from '../server';
import { generateProfileName } from '../utils/generateProfileName';
import { twitterLogger } from './twitter.utils';
import DbInterface from '../db/db_wrapper';

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

const TWEETS_PER_PAGE = 25;

const formatTweets =
  (profileId: number) =>
  (tweet: Tweet): Tweet => ({
    ...tweet,
    isMine: tweet.profile_id === profileId,
    isRetweet: tweet.isRetweet === 1,
  });

export class _TwitterDB {
  /**
   * Retrieve the latest 50 tweets
   * @param profileId - twitter profile id of the player
   */
  async fetchAllTweets(profileId: number, currPage: number): Promise<Tweet[]> {
    currPage = typeof currPage === 'number' ? currPage : 1; // avoid sql injection without prepared query
    const query = `
        SELECT ${SELECT_FIELDS}
        FROM (
          SELECT * FROM npwd_twitter_tweets ORDER BY id DESC LIMIT ${TWEETS_PER_PAGE} OFFSET ${
      TWEETS_PER_PAGE * currPage
    }
        ) npwd_twitter_tweets
                 LEFT OUTER JOIN npwd_twitter_profiles
                                 ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
                 LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id AND
                                                       npwd_twitter_likes.profile_id = ?
                 LEFT OUTER JOIN npwd_twitter_reports ON npwd_twitter_tweets.id = npwd_twitter_reports.tweet_id AND
                                                         npwd_twitter_reports.profile_id = ?
                 LEFT OUTER JOIN npwd_twitter_tweets AS retweets ON retweets.id = npwd_twitter_tweets.retweet
                 LEFT OUTER JOIN npwd_twitter_profiles AS retweets_profiles
                                 ON retweets.identifier = retweets_profiles.identifier
        WHERE npwd_twitter_tweets.visible = 1
		`;
    const [results] = await DbInterface._rawExec(query, [profileId, profileId]);
    const tweets = <Tweet[]>results;
    return tweets.map(formatTweets(profileId));
  }

  /**
   * Fetch tweets by some search value submitted by the user. Intended to let
   * player's search for tweets by profile, message or more.
   * @param profileId - twitter profile id of the player
   * @param searchValue - value to search
   */
  async fetchTweetsFiltered(profileId: number, searchValue: string): Promise<Tweet[]> {
    const parameterizedSearchValue = `%${searchValue}%`;
    const query = `
        SELECT ${SELECT_FIELDS}
        FROM npwd_twitter_tweets
                 LEFT OUTER JOIN npwd_twitter_profiles
                                 ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
                 LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id AND
                                                       npwd_twitter_likes.profile_id = ?
                 LEFT OUTER JOIN npwd_twitter_reports ON npwd_twitter_tweets.id = npwd_twitter_reports.tweet_id AND
                                                         npwd_twitter_reports.profile_id = ?
                 LEFT OUTER JOIN npwd_twitter_tweets AS retweets ON retweets.id = npwd_twitter_tweets.retweet
                 LEFT OUTER JOIN npwd_twitter_profiles AS retweets_profiles
                                 ON retweets.identifier = retweets_profiles.identifier
        WHERE npwd_twitter_tweets.visible = 1
          AND (npwd_twitter_profiles.profile_name LIKE ? OR npwd_twitter_tweets.message LIKE ?)
        ORDER BY npwd_twitter_tweets.id DESC LIMIT 100
		`;
    const [results] = await DbInterface._rawExec(query, [
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
  async getTweet(profileId: number, tweetId: number): Promise<Tweet> {
    const query = `
        SELECT ${SELECT_FIELDS}
        FROM npwd_twitter_tweets
                 LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id AND
                                                       npwd_twitter_likes.profile_id = ?
                 LEFT OUTER JOIN npwd_twitter_reports ON npwd_twitter_tweets.id = npwd_twitter_reports.tweet_id AND
                                                         npwd_twitter_reports.profile_id = ?
                 LEFT OUTER JOIN npwd_twitter_tweets AS retweets ON retweets.id = npwd_twitter_tweets.retweet
                 LEFT OUTER JOIN npwd_twitter_profiles AS retweets_profiles
                                 ON retweets.identifier = retweets_profiles.identifier
                 LEFT OUTER JOIN npwd_twitter_profiles
                                 ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
        WHERE npwd_twitter_tweets.id = ?
		`;
    const [results] = await DbInterface._rawExec(query, [profileId, profileId, tweetId]);
    const tweets = <Tweet[]>results;
    return tweets.map(formatTweets(profileId))[0];
  }

  /**
   * Creates a tweet in the database and then retrieves the tweet
   * @param identifier - player identifier
   * @param tweet - tweet to be created
   */
  async createTweet(identifier: string, tweet: NewTweet): Promise<Tweet> {
    const profile = await this.getProfile(identifier);
    const query = `
        INSERT INTO npwd_twitter_tweets (identifier, message, images, retweet)
        VALUES (?, ?, ?, ?)
		`;
    const [results] = await DbInterface._rawExec(query, [
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
    return await this.getTweet(profile.id, insertData.insertId);
  }

  async createTweetReport(tweetId: number, profileId: number): Promise<void> {
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
  async getProfile(identifier: string): Promise<Profile | null> {
    const query = `
        SELECT *
        FROM npwd_twitter_profiles
        WHERE identifier = ? LIMIT 1
		`;
    const [results] = await DbInterface._rawExec(query, [identifier]);
    const profiles = <Profile[]>results;
    return profiles.length > 0 ? profiles[0] : null;
  }

  /**
   * Create a twitter profile
   * @param identifier - player's identifier
   * @param profileName - profile name to be created
   * @returns
   */
  async createProfile(identifier: string, profileName: string): Promise<Profile> {
    const query = `
        INSERT INTO npwd_twitter_profiles (identifier, profile_name)
        VALUES (?, ?)
		`;

    await pool.execute(query, [identifier, profileName]);
    return await this.getProfile(identifier);
  }

  /**
   * Create a default twitter profile for a player. This is the intial profile
   * that all player's will receive and can then customize.
   * @param identifier - player's identifier
   */
  async createDefaultProfile(identifier: string): Promise<Profile | null> {
    // case where the server owner wants players to select their own names
    if (!config.twitter.generateProfileNameFromUsers) return null;

    const defaultProfileName = await generateProfileName(identifier);
    // case where we tried to generate a profile name but failed due to
    // some database misconfiguration or error
    if (!defaultProfileName) return null;

    twitterLogger.info(`Creating default Twitter profile ${defaultProfileName} for ${identifier}`);
    return await this.createProfile(identifier, defaultProfileName);
  }

  /**
   * Retrieve the player's profile by their identifier if it exists. If
   * not, create it and return it.
   * @param identifier - player's identifier
   */
  async getOrCreateProfile(identifier: string): Promise<Profile> {
    const profile = await this.getProfile(identifier);
    return profile || (await this.createDefaultProfile(identifier));
  }

  async updateProfile(identifier: string, profile: Profile) {
    const { avatar_url, profile_name, bio, location, job } = profile;
    const query = `
        UPDATE npwd_twitter_profiles
        SET avatar_url   = ?,
            profile_name = ?,
            bio          = ?,
            location     = ?,
            job          = ?
        WHERE identifier = ?
		`;
    await pool.execute(query, [avatar_url, profile_name, bio, location, job, identifier]);
  }

  /**
   * Create a "like" in the database that ties a profile & tweet together
   * @param profileId - primary key of the profile conducting the like
   * @param tweetId - primary key of the tweet being liked
   */
  async createLike(profileId: number, tweetId: number): Promise<void> {
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
  async deleteLike(profileId: number, tweetId: number): Promise<void> {
    const query = `
        DELETE
        FROM npwd_twitter_likes
        WHERE profile_id = ?
          AND tweet_id = ?
		`;
    await pool.execute(query, [profileId, tweetId]);
  }

  /**
   * Delete a tweet from the database
   * @param identifier - identifier of the source user
   * @param tweetId - primary key of the tweet to remove the like from
   */
  async deleteTweet(identifier: string, tweetId: number): Promise<void> {
    if (!config.twitter.allowDeleteTweets) return;

    const query = `
        DELETE
        FROM npwd_twitter_tweets
        WHERE identifier = ?
          AND id = ?
		`;
    await pool.execute(query, [identifier, tweetId]);
  }

  /**
   * Check if a "like" relationship between a profile and a tweet exists
   * @param profileId - primary key of the profile to check
   * @param tweetId - primary key of the tweet to check
   */
  async doesLikeExist(profileId: number, tweetId: number): Promise<boolean> {
    const query = `
        SELECT *
        FROM npwd_twitter_likes
        WHERE profile_id = ?
          AND tweet_id = ? LIMIT 1
		`;
    const [results] = await DbInterface._rawExec(query, [profileId, tweetId]);
    const likes = <any[]>results;
    return likes.length > 0;
  }

  /**
   * Check if a tweet has been reported by this profile already
   * @param tweetId - primary key of the tweet to check
   * @param profileId - primary key of the profile to check
   */
  async doesReportExist(tweetId: number, profileId: number): Promise<boolean> {
    const query = `
        SELECT *
        FROM npwd_twitter_reports
        WHERE tweet_id = ?
          AND profile_id = ? LIMIT 1
		`;
    const [results] = await DbInterface._rawExec(query, [tweetId, profileId]);
    const reports = <any[]>results;
    return reports.length > 0;
  }

  /**
   * Check to see if this player has already retweeted this tweet or
   * is the original poster of a retweeted tweet
   * @param tweetId - ID of the tweet in question
   * @param identifier - player identifier of the person performing the retweet
   */
  async doesRetweetExist(tweetId: number, identifier: string): Promise<boolean> {
    const query = `
        SELECT COUNT(id) as count
        FROM npwd_twitter_tweets
        WHERE (id = ? OR retweet = ?) AND identifier = ?
		`;
    const [results] = await DbInterface._rawExec(query, [tweetId, tweetId, identifier]);
    const counts = <any[]>results;
    return counts[0].count > 0;
  }
}

const TwitterDB = new _TwitterDB();

export default TwitterDB;
