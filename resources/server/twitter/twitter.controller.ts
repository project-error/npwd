import { config } from '../server';
import { twitterLogger } from './twitter.utils';
import { Profile, Tweet, TwitterEvents } from '../../../typings/twitter';
import { getSource } from '../utils/miscUtils';
import TwitterService from './twitter.service';
import { onNetPromise } from '../utils/PromiseNetEvents/onNetPromise';

onNet(TwitterEvents.GET_OR_CREATE_PROFILE, async () => {
  const _source = getSource();
  TwitterService.handleGetOrCreateProfile(_source).catch((e) =>
    twitterLogger.error(
      `Error occurred in getOrCreateProfile event (${_source}), Error: ${e.message}`,
    ),
  );
});

onNet(TwitterEvents.CREATE_PROFILE, async (profile: Profile) => {
  const _source = getSource();
  TwitterService.handleCreateProfile(_source, profile).catch((e) =>
    twitterLogger.error(`Error occurred in createProfile event (${_source}), Error: ${e.message}`),
  );
});

onNet(TwitterEvents.UPDATE_PROFILE, async (profile: Profile) => {
  const _source = getSource();
  TwitterService.handleUpdateProfile(_source, profile).catch((e) =>
    twitterLogger.error(`Error occurred in updateProfile event (${_source}), Error: ${e.message}`),
  );
});
/*
onNet(TwitterEvents.FETCH_TWEETS, async (pageI: number) => {
  const _source = getSource();
  TwitterService.handleFetchTweets(_source, pageI).catch((e) =>
    twitterLogger.error(`Error occurred in fetchTweets event (${_source}), Error: ${e.message}`),
  );
});
 */

onNet(TwitterEvents.FETCH_TWEETS_FILTERED, async (searchValue: string) => {
  const _source = getSource();
  TwitterService.handleFetchTweetsFiltered(_source, searchValue).catch((e) =>
    twitterLogger.error(
      `Error occurred in fetchTweetsFiltered event (${_source}), Error: ${e.message}`,
    ),
  );
});

onNet(TwitterEvents.CREATE_TWEET, async (tweet: Tweet) => {
  const _source = getSource();
  TwitterService.handleCreateTweet(_source, tweet).catch((e) =>
    twitterLogger.error(`Error occurred in createTweet event (${_source}), Error: ${e.message}`),
  );
});

onNet(TwitterEvents.DELETE_TWEET, async (tweetId: number) => {
  const _source = getSource();
  TwitterService.handleDeleteTweet(_source, tweetId).catch((e) =>
    twitterLogger.error(`Error occurred in deleteTweet event (${_source}), Error: ${e.message}`),
  );
});

onNet(TwitterEvents.TOGGLE_LIKE, async (tweetId: number) => {
  const _source = getSource();
  TwitterService.handleToggleLike(_source, tweetId).catch((e) =>
    twitterLogger.error(`Error occurred in toggleEvent event (${_source}), Error: ${e.message}`),
  );
});

onNet(TwitterEvents.RETWEET, async (tweetId: number) => {
  const _source = getSource();
  TwitterService.handleRetweet(_source, tweetId).catch((e) =>
    twitterLogger.error(`Error occurred in retweet event (${_source}), Error: ${e.message}`),
  );
});

onNet(TwitterEvents.REPORT, async (tweetId: number) => {
  const _source = getSource();
  TwitterService.handleReport(_source, tweetId).catch((e) =>
    twitterLogger.error(`Error occurred in report event (${_source}), Error: ${e.message}`),
  );
});

onNetPromise<{ pageId: number }, Tweet[]>(TwitterEvents.FETCH_TWEETS, (req, res) => {
  TwitterService.handleFetchTweets(req.source, req.data.pageId, res).catch((e) =>
    twitterLogger.error(`Error occurred in fetchTweets event (${req.source}), Error: ${e.message}`),
  );
});

if (!config.twitter.allowEditableProfileName && !config.twitter.generateProfileNameFromUsers) {
  const warning =
    `Both allowEdtiableProfileName and generateProfileNameFromUsers ` +
    `are set false - this means users will likely not have profile names ` +
    `for the Twitter App and won't be able to use it!`;
  twitterLogger.warn(warning);
}
