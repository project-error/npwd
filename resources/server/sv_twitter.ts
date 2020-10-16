import { pool } from './db';
import { ESX, getSource } from './server';
import events from '../utils/events';
import config from '../utils/config';

interface Profile {
    id: number;
    profile_name: string;
    identifier: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    job?: string;
    createdAt: string;
    updatedAt: string;
}

interface ProfileName {
    profile_name: string;
}

interface Tweet {
    id: number;
    profile_name?: string;
    avatar_url?: string;
    message: string;
    createdAt?: string;
    updatedAt?: string;
    images?: string;
    likes?: number;
}

/**
 * Retrieve the latest 100 tweets
 * @param profileId - twitter profile id of the player
 */
async function fetchAllTweets(profileId: number): Promise<Tweet[]> {
    const query = `
        SELECT
        npwd_twitter_profiles.profile_name,
        npwd_twitter_profiles.avatar_url,
        npwd_twitter_tweets.*,
        npwd_twitter_likes.id IS NOT NULL AS isLiked,
        TIME_TO_SEC(TIMEDIFF( NOW(), npwd_twitter_tweets.createdAt)) AS seconds_since_tweet
    FROM npwd_twitter_tweets
    LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
    LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id  AND npwd_twitter_likes.profile_id = ?
    WHERE visible = 1
    ORDER BY npwd_twitter_tweets.createdAt DESC 
    LIMIT 100
    `;
    const [ results ] = await pool.query(query, [profileId]);
    const tweets = <Tweet[]>results;
    return tweets;
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
        npwd_twitter_profiles.profile_name,
        npwd_twitter_profiles.avatar_url,
        npwd_twitter_tweets.*,
        npwd_twitter_likes.id IS NOT NULL AS isLiked,
        TIME_TO_SEC(TIMEDIFF( NOW(), npwd_twitter_tweets.createdAt)) AS seconds_since_tweet
    FROM npwd_twitter_tweets
    LEFT OUTER JOIN npwd_twitter_profiles ON npwd_twitter_tweets.identifier = npwd_twitter_profiles.identifier
    LEFT OUTER JOIN npwd_twitter_likes ON npwd_twitter_tweets.id = npwd_twitter_likes.tweet_id  AND npwd_twitter_likes.profile_id = ?
    WHERE visible = 1 AND (npwd_twitter_profiles.profile_name LIKE ? OR npwd_twitter_tweets.message LIKE ?)
    ORDER BY npwd_twitter_tweets.createdAt DESC 
    LIMIT 100
    `;
    const [ results ] = await pool.query(query, [profileId, parameterizedSearchValue, parameterizedSearchValue]);
    const tweets = <Tweet[]>results;
    return tweets;
}

/**
 * Creates a tweet in the database
 * @param identifier - player identifier
 * @param tweet - tweet to be created
 */
async function createTweet(identifier: string, tweet: Tweet): Promise<any> {
    const query = `
    INSERT INTO npwd_twitter_tweets (identifier, message, images)
    VALUES (?, ?, ?)
    `
    await pool.query(query, [identifier, tweet.message, tweet.images])
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
    const [ results ] = await pool.query(query, [identifier]);
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
    `
    const [ results ] = await pool.query(query, [identifier]);
    const profileNames = <ProfileName[]>results;

    if (profileNames.length === 0) return defaultProfileName;
    return profileNames[0].profile_name;
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
    `
    const [ result ] = await pool.execute(query, [identifier, profileName]);
    return getProfile(identifier);
}

/**
 * Retrieve the player's profile by their identifier if it exists. If
 * not, create it and return it.
 * @param identifier - player's identifier
 */
async function getOrCreateProfile(identifier: string): Promise<Profile> {
    const profile = await getProfile(identifier);
    return profile || await createDefaultProfile(identifier);
}

async function updateProfile(identifier: string, profile: Profile) {
    const { avatar_url, profile_name, bio, location, job } = profile;
    const query = `
    UPDATE npwd_twitter_profiles
    SET avatar_url = ?, profile_name = ?, bio = ?, location = ?, job = ?
    WHERE identifier = ?
    `
    await pool.execute(query, [
        avatar_url,
        profile_name,
        bio,
        location,
        job,
        identifier
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
    `
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
    `
    await pool.execute(query, [profileId, tweetId]);
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
    `
    const [ results ] = await pool.query(query, [profileId, tweetId]);
    const likes = <any[]>results;
    return likes.length > 0;
}


onNet(events.TWITTER_GET_OR_CREATE_PROFILE, async () => {
    try {
        const identifier = ESX.GetPlayerFromId(getSource()).getIdentifier();
        const profile = await getOrCreateProfile(identifier)
        emitNet(events.TWITTER_GET_OR_CREATE_PROFILE_SUCCESS, getSource(), profile);
    } catch (e) {
        emitNet(events.TWITTER_GET_OR_CREATE_PROFILE_FAILURE, getSource());
    }
});

onNet(events.TWITTER_UPDATE_PROFILE, async (profile: Profile) => {
    try {
        const identifier = ESX.GetPlayerFromId(getSource()).getIdentifier();
        await updateProfile(identifier, profile)
        emitNet(events.TWITTER_UPDATE_PROFILE_RESULT, getSource(), true);
    } catch (e) {
        emitNet(events.TWITTER_UPDATE_PROFILE_RESULT, getSource(), false);
    }
});

onNet(events.TWITTER_FETCH_TWEETS, async () => {
    try {
        const identifier = ESX.GetPlayerFromId(getSource()).getIdentifier();
        const profile = await getProfile(identifier);
        const tweets = await fetchAllTweets(profile.id);
        emitNet(events.TWITTER_FETCH_TWEETS_SUCCESS, getSource(), tweets);
    } catch (e) {
        emitNet(events.TWITTER_FETCH_TWEETS_FAILURE, getSource());
    }
});

onNet(events.TWITTER_FETCH_TWEETS_FILTERED, async (searchValue: string) => {
    try {
        const identifier = ESX.GetPlayerFromId(getSource()).getIdentifier();
        const profile = await getProfile(identifier);
        const tweets = await fetchTweetsFiltered(profile.id, searchValue);
        emitNet(events.TWITTER_FETCH_TWEETS_FILTERED_SUCCESS, getSource(), tweets);
    } catch (e) {
        emitNet(events.TWITTER_FETCH_TWEETS_FILTERED_FAILURE, getSource());
    }
});

onNet(events.TWITTER_CREATE_TWEET, async (tweet: Tweet) => {
    try {
        const identifier = ESX.GetPlayerFromId(getSource()).getIdentifier();
        await createTweet(identifier, tweet);
        emitNet(events.TWITTER_CREATE_TWEET_RESULT, getSource(), true);
    } catch (e) {
        emitNet(events.TWITTER_CREATE_TWEET_RESULT, getSource(), false);
    }
});


onNet(events.TWITTER_TOGGLE_LIKE, async (tweetId: number) => {
    try {
        const identifier = ESX.GetPlayerFromId(getSource()).getIdentifier();
        const profile = await getOrCreateProfile(identifier)
        const likeExists = await doesLikeExist(profile.id, tweetId);
        if (likeExists) {
            await deleteLike(profile.id, tweetId);
        } else {
            await createLike(profile.id, tweetId);
        }
        emitNet(events.TWITTER_TOGGLE_LIKE_SUCCESS, getSource());
    } catch (e) {
        emitNet(events.TWITTER_TOGGLE_LIKE_FAILURE, getSource());
    }
});