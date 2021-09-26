import PlayerService from '../players/player.service';
import TwitterDB, { _TwitterDB } from './twitter.db';
import { NewTweet, Profile, Tweet, TwitterEvents } from '../../../typings/twitter';
import { twitterLogger } from './twitter.utils';
import { reportTweetToDiscord } from '../misc/discord';
import { PromiseEventResp } from '../utils/PromiseNetEvents/promise.types';

class _TwitterService {
  private readonly twitterDB: _TwitterDB;

  constructor() {
    this.twitterDB = TwitterDB;
    twitterLogger.debug('Twitter service started');
  }

  async handleGetOrCreateProfile(src: number) {
    const identifier = PlayerService.getIdentifier(src);

    try {
      const profile = await this.twitterDB.getOrCreateProfile(identifier);

      // if we got null from getOrCreateProfile it means it doesn't exist and
      // we failed to create it. In this case we pass the UI some default
      // profile names it can choose from.

      // We should be able to comment this out as profile **should** be guranteed,
      // as we create a default profile in that process.

      // if (!profile) {
      //   const defaultProfileNames = await getDefaultProfileNames(identifier);
      //   emitNet(TwitterEvents.GET_OR_CREATE_PROFILE_NULL, _source, defaultProfileNames);
      // } else {
      emitNet(TwitterEvents.GET_OR_CREATE_PROFILE_SUCCESS, src, profile);
      // }
    } catch (e) {
      emitNet(TwitterEvents.GET_OR_CREATE_PROFILE_FAILURE, src);
      twitterLogger.error(`Failed to get or create profile, ${e.message}`, {
        source: src,
      });
    }
  }

  async handleCreateProfile(src: number, profile: Profile) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      await this.twitterDB.createProfile(identifier, profile.profile_name);

      emitNet(TwitterEvents.CREATE_PROFILE_RESULT, src, {
        message: 'TWITTER_CREATE_PROFILE_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      twitterLogger.error(`Failed to create twitter profile: ${e.message}`, {
        source: src,
      });
      emitNet(TwitterEvents.CREATE_PROFILE_RESULT, src, {
        message: 'TWITTER_CREATE_PROFILE_FAILURE',
        type: 'error',
      });
    }
  }

  async handleUpdateProfile(src: number, profile: Profile) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      await this.twitterDB.updateProfile(identifier, profile);
      emitNet(TwitterEvents.UPDATE_PROFILE_RESULT, src, {
        message: 'TWITTER_EDIT_PROFILE_SUCCESS',
        type: 'success',
      });
    } catch (e) {
      twitterLogger.error(`Failed to update twitter profile: ${e.message}`, {
        source: src,
      });
      emitNet(TwitterEvents.UPDATE_PROFILE_RESULT, src, {
        message: 'TWITTER_EDIT_PROFILE_FAILURE',
        type: 'error',
      });
    }
  }

  async handleFetchTweets(src: number, pageIdx: number, resp: PromiseEventResp<Tweet[]>) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      const profile = await this.twitterDB.getProfile(identifier);

      if (!profile)
        return twitterLogger.warn(
          `Aborted fetching tweets for user ${identifier} because they do not have a profile.`,
        );

      const tweets = await this.twitterDB.fetchAllTweets(profile.id, pageIdx);
      //emitNet(TwitterEvents.FETCH_TWEETS_SUCCESS, src, tweets);
      resp({ data: tweets, status: 'ok' });
    } catch (e) {
      twitterLogger.error(`Fetching tweets failed, ${e.message}`, {
        source: src,
      });
      resp({ status: 'error', errorMsg: e.message });
      //emitNet(TwitterEvents.FETCH_TWEETS_FAILURE, src);
    }
  }

  async handleFetchTweetsFiltered(src: number, searchValue: string) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      const profile = await this.twitterDB.getProfile(identifier);
      const tweets = await this.twitterDB.fetchTweetsFiltered(profile.id, searchValue);
      emitNet(TwitterEvents.FETCH_TWEETS_FILTERED_SUCCESS, src, tweets);
    } catch (e) {
      twitterLogger.error(`Fetch filtered tweets failed, ${e.message}`, {
        source: src,
      });
      emitNet(TwitterEvents.FETCH_TWEETS_FILTERED_FAILURE, src);
    }
  }

  async handleCreateTweet(src: number, tweet: Tweet) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      const createdTweet = await this.twitterDB.createTweet(identifier, tweet);
      emitNet(TwitterEvents.CREATE_TWEET_BROADCAST, -1, createdTweet);
    } catch (e) {
      twitterLogger.error(`Create tweet failed, ${e.message}`, {
        source: src,
      });
      emitNet(TwitterEvents.CREATE_TWEET_RESULT, src, {
        message: 'TWITTER_CREATE_FAILED',
        type: 'error',
      });
    }
  }

  async handleDeleteTweet(src: number, tweetId: number) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      await this.twitterDB.deleteTweet(identifier, tweetId);
      emitNet(TwitterEvents.DELETE_TWEET_SUCCESS, src);
    } catch (e) {
      twitterLogger.error(`Delete tweet failed, ${e.message}`, {
        source: src,
      });
      emitNet(TwitterEvents.DELETE_TWEET_FAILURE, src);
    }
  }

  async handleToggleLike(src: number, tweetId: number) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      const profile = await this.twitterDB.getOrCreateProfile(identifier);
      const likeExists = await this.twitterDB.doesLikeExist(profile.id, tweetId);

      if (likeExists) {
        await this.twitterDB.deleteLike(profile.id, tweetId);
      } else {
        await this.twitterDB.createLike(profile.id, tweetId);
      }

      emitNet(TwitterEvents.TOGGLE_LIKE_SUCCESS, src);
    } catch (e) {
      twitterLogger.error(`Like failed, ${e.message}`, {
        source: src,
      });
      emitNet(TwitterEvents.TOGGLE_LIKE_FAILURE, src);
    }
  }

  async handleRetweet(src: number, tweetId: number) {
    try {
      const identifier = PlayerService.getIdentifier(src);

      // alert the player that they have already retweeted
      // this post (or that they are the original poster)
      if (await this.twitterDB.doesRetweetExist(tweetId, identifier)) {
        return emitNet(TwitterEvents.RETWEET_EXISTS, src, {
          message: 'TWITTER_RETWEET_EXISTS',
          type: 'error',
        });
      }

      // our message for this row is blank because when we
      // query for this tweet it will join off of the retweet
      // column and fetch the message from the related tweet
      const retweet: NewTweet = { message: '', retweet: tweetId };
      const createdTweet = await this.twitterDB.createTweet(identifier, retweet);

      const profile = await this.twitterDB.getProfile(identifier);
      const tweet = await this.twitterDB.getTweet(profile.id, createdTweet.id);
      emitNet(TwitterEvents.CREATE_TWEET_BROADCAST, -1, tweet);
    } catch (e) {
      twitterLogger.error(`Retweet failed, ${e.message}`, {
        source: src,
      });
      emitNet(TwitterEvents.RETWEET_FAILURE, src);
    }
  }

  async handleReport(src: number, tweetId: number) {
    try {
      const identifier = PlayerService.getIdentifier(src);
      const profile = await this.twitterDB.getProfile(identifier);
      const tweet = await this.twitterDB.getTweet(profile.id, tweetId);

      const reportExists = await this.twitterDB.doesReportExist(tweet.id, profile.id);

      if (reportExists) {
        return twitterLogger.warn('This profile has already reported this tweet');
      }

      await this.twitterDB.createTweetReport(tweet.id, profile.id);
      await reportTweetToDiscord(tweet, profile);

      emitNet(TwitterEvents.REPORT_SUCCESS, src);
    } catch (e) {
      emitNet(TwitterEvents.REPORT_FAILURE, src);
      twitterLogger.error(`Twitter report failed, ${e.message}`, {
        source: src,
      });
    }
  }
}

const TwitterService = new _TwitterService();

export default TwitterService;
