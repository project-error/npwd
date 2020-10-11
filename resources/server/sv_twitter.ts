import { pool } from './db';

async function fetchAllTweets(profileId: number) {
    try {
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
        const [results ] = await pool.query(query, [profileId]);
    } catch (e) {
        console.warn(e)
    }
}

async function fetchTweetsFiltered(profileId: number, searchValue: string) {
    try {
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
        WHERE visible = 1 AND (npwd_twitter_profiles.profile_name LIKE @profile_name OR npwd_twitter_tweets.message LIKE ?)
        ORDER BY npwd_twitter_tweets.createdAt DESC 
        LIMIT 100
        `;
        const [results ] = await pool.query(query, [profileId, parameterizedSearchValue]);
    } catch (e) {
        console.warn(e)
    }
}
