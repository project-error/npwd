import { FormattedTweet, Profile, Tweet } from '@typings/twitter';
import { IMAGE_DELIMITER } from './images';
import { v4 as uuidv4 } from 'uuid';

/**
 * Perform all necessary processing/transforms from the raw database
 * data to what the frontend expects
 * @param {object} tweet - full JSON returned from the server/database
 */
export function processTweet(tweet: Tweet): FormattedTweet {
  // we store images in the database as a varchar field with
  // comma separated links to images, so here we split them
  // back into their distinct members
  const imageLinks = tweet.images ? tweet.images.split(IMAGE_DELIMITER) : [];
  const images = imageLinks.map((link) => ({ id: uuidv4(), link }));
  return { ...tweet, images };
}

/**
 * in the case a tweet is broadcasted we can make some assumptions
 * that it is brand new and hasn't been liked. We should also need
 * to overwrite isMine since that will be true (sourced from another
 * player's tweet)
}
 * @param tweet - tweet to process
 * @param playerIdentifier - the current player's identifier
 * @returns Formatted Tweet
 */
export function processBroadcastedTweet(tweet: Tweet, profile: Profile): FormattedTweet {
  const processedTweet = processTweet(tweet);
  const isLiked = false;
  const isMine = profile?.identifier === tweet.identifier;
  return { ...processedTweet, isMine, isLiked };
}
