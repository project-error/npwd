import PlayerService from '../players/player.service';
import TwitterDB, { _TwitterDB } from './twitter.db';
import { NewTweet, Profile, Tweet, TwitterEvents } from '../../../typings/twitter';
import { twitterLogger } from './twitter.utils';
import { reportTweetToDiscord } from '../misc/discord';
import { PromiseEventResp, PromiseRequest } from '../utils/PromiseNetEvents/promise.types';

class _TwitterService {
  private readonly twitterDB: _TwitterDB;

  constructor() {
    this.twitterDB = TwitterDB;
    twitterLogger.debug('Twitter service started');
  }

  async handleGetOrCreateProfile(
    reqObj: PromiseRequest<void>,
    resp: PromiseEventResp<Profile | string[]>,
  ) {
    const identifier = PlayerService.getIdentifier(reqObj.source);

    try {
      const profile = await this.twitterDB.getOrCreateProfile(identifier);

      // if we got null from getOrCreateProfile it means it doesn't exist and
      // we failed to create it. In this case we pass the UI some default
      // profile names it can choose from.

      // We should be able to comment this out as profile **should** be guranteed,
      // as we create a default profile in that process.

      if (!profile) {
        emitNet(TwitterEvents.GET_OR_CREATE_PROFILE_NULL, reqObj.source, ['chip', 'taso']);
      } else {
        resp({ status: 'ok', data: profile });
      }
    } catch (e) {
      emitNet(TwitterEvents.GET_OR_CREATE_PROFILE_FAILURE, reqObj.source);
      twitterLogger.error(`Failed to get or create profile, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }

  async handleCreateProfile(reqObj: PromiseRequest<Profile>, resp: PromiseEventResp<void>) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      await this.twitterDB.createProfile(identifier, reqObj.data.profile_name);

      // should we get the profile here?
      resp({ status: 'ok' });
    } catch (e) {
      twitterLogger.error(`Failed to create twitter profile: ${e.message}`, {
        source: reqObj.source,
      });

      resp({ status: 'error', errorMsg: e.message });
    }
  }

  async handleUpdateProfile(reqObj: PromiseRequest<Profile>, resp: PromiseEventResp<void>) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      await this.twitterDB.updateProfile(identifier, reqObj.data);

      resp({ status: 'ok' });
    } catch (e) {
      twitterLogger.error(`Failed to update twitter profile: ${e.message}`, {
        source: reqObj.source,
      });
      resp({ status: 'error', errorMsg: e.message });
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

      resp({ data: tweets, status: 'ok' });
    } catch (e) {
      twitterLogger.error(`Fetching tweets failed, ${e.message}`, {
        source: src,
      });
      resp({ status: 'error', errorMsg: e.message });
    }
  }

  async handleFetchTweetsFiltered(
    reqObj: PromiseRequest<{ searchValue: string }>,
    resp: PromiseEventResp<Tweet[]>,
  ) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const profile = await this.twitterDB.getProfile(identifier);
      const tweets = await this.twitterDB.fetchTweetsFiltered(profile.id, reqObj.data.searchValue);

      resp({ status: 'ok', data: tweets });
    } catch (e) {
      twitterLogger.error(`Fetch filtered tweets failed, ${e.message}`, {
        source: reqObj.source,
      });
      resp({ status: 'error', errorMsg: e.message });
    }
  }

  async handleCreateTweet(
    reqObj: PromiseRequest<Tweet>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const createdTweet = await this.twitterDB.createTweet(identifier, reqObj.data);

      resp({ status: 'ok' });
      emitNet(TwitterEvents.CREATE_TWEET_BROADCAST, -1, createdTweet);
    } catch (e) {
      twitterLogger.error(`Create tweet failed, ${e.message}`, {
        source: reqObj.source,
      });
      emitNet(TwitterEvents.CREATE_TWEET_RESULT, reqObj.source, {
        message: 'TWITTER_CREATE_FAILED',
        type: 'error',
      });
    }
  }

  async handleDeleteTweet(
    reqObj: PromiseRequest<{ tweetId: number }>,
    resp: PromiseEventResp<void>,
  ) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      await this.twitterDB.deleteTweet(identifier, reqObj.data.tweetId);

      resp({ status: 'ok' });
    } catch (e) {
      twitterLogger.error(`Delete tweet failed, ${e.message}`, {
        source: reqObj.source,
      });

      resp({ status: 'error', errorMsg: e.message });
    }
  }

  async handleToggleLike(
    reqObj: PromiseRequest<{ tweetId: number }>,
    resp: PromiseEventResp<void>,
  ) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const profile = await this.twitterDB.getOrCreateProfile(identifier);
      const likeExists = await this.twitterDB.doesLikeExist(profile.id, reqObj.data.tweetId);

      if (likeExists) {
        await this.twitterDB.deleteLike(profile.id, reqObj.data.tweetId);
      } else {
        await this.twitterDB.createLike(profile.id, reqObj.data.tweetId);
      }

      resp({ status: 'ok' });
    } catch (e) {
      twitterLogger.error(`Like failed, ${e.message}`, {
        source: reqObj.source,
      });

      resp({ status: 'error', errorMsg: e.message });
    }
  }

  async handleRetweet(reqObj: PromiseRequest<{ tweetId: number }>, resp: PromiseEventResp<void>) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);

      // alert the player that they have already retweeted
      // this post (or that they are the original poster)
      if (await this.twitterDB.doesRetweetExist(reqObj.data.tweetId, identifier)) {
        return emitNet(TwitterEvents.RETWEET_EXISTS, reqObj.source, {
          message: 'TWITTER_RETWEET_EXISTS',
          type: 'error',
        });
      }

      // our message for this row is blank because when we
      // query for this tweet it will join off of the retweet
      // column and fetch the message from the related tweet
      const retweet: NewTweet = { message: '', retweet: reqObj.data.tweetId };
      const createdTweet = await this.twitterDB.createTweet(identifier, retweet);

      const profile = await this.twitterDB.getProfile(identifier);
      const tweet = await this.twitterDB.getTweet(profile.id, createdTweet.id);

      resp({ status: 'ok' });
      emitNet(TwitterEvents.CREATE_TWEET_BROADCAST, -1, tweet);
    } catch (e) {
      twitterLogger.error(`Retweet failed, ${e.message}`, {
        source: reqObj.source,
      });

      resp({ status: 'error', errorMsg: e.message });
    }
  }

  async handleReport(reqObj: PromiseRequest<{ tweetId: number }>, resp: PromiseEventResp<void>) {
    try {
      const identifier = PlayerService.getIdentifier(reqObj.source);
      const profile = await this.twitterDB.getProfile(identifier);
      const tweet = await this.twitterDB.getTweet(profile.id, reqObj.data.tweetId);

      const reportExists = await this.twitterDB.doesReportExist(tweet.id, profile.id);

      if (reportExists) {
        return twitterLogger.warn('This profile has already reported this tweet');
      }

      await this.twitterDB.createTweetReport(tweet.id, profile.id);
      await reportTweetToDiscord(tweet, profile);

      resp({ status: 'ok' });
    } catch (e) {
      resp({ status: 'error', errorMsg: e.message });
      twitterLogger.error(`Twitter report failed, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }
}

const TwitterService = new _TwitterService();

export default TwitterService;
