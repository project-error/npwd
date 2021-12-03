import { config } from '../server';
import { twitterLogger } from './twitter.utils';
import { Profile, Tweet, TwitterEvents } from '../../../typings/twitter';
import { getSource } from '../utils/miscUtils';
import TwitterService from './twitter.service';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNetPromise<void, Profile | string[]>(
  TwitterEvents.GET_OR_CREATE_PROFILE,
  async (reqObj, resp) => {
    const _source = getSource();
    TwitterService.handleGetOrCreateProfile(reqObj, resp).catch((e) => {
      twitterLogger.error(
        `Error occurred in getOrCreateProfile event (${_source}), Error: ${e.message}`,
      );
    });
  },
);

onNetPromise<Profile, Profile>(TwitterEvents.CREATE_PROFILE, async (reqObj, resp) => {
  const _source = getSource();
  TwitterService.handleCreateProfile(reqObj, resp).catch((e) =>
    twitterLogger.error(`Error occurred in createProfile event (${_source}), Error: ${e.message}`),
  );
});

onNetPromise<Profile, Profile>(TwitterEvents.UPDATE_PROFILE, async (reqObj, resp) => {
  const _source = getSource();
  TwitterService.handleUpdateProfile(reqObj, resp).catch((e) =>
    twitterLogger.error(`Error occurred in updateProfile event (${_source}), Error: ${e.message}`),
  );
});

onNetPromise<{ searchValue: string }, Tweet[]>(
  TwitterEvents.FETCH_TWEETS_FILTERED,
  async (reqObj, resp) => {
    console.log('getting some filtered tweets');
    const _source = getSource();
    TwitterService.handleFetchTweetsFiltered(reqObj, resp).catch((e) =>
      twitterLogger.error(
        `Error occurred in fetchTweetsFiltered event (${_source}), Error: ${e.message}`,
      ),
    );
  },
);

onNetPromise<Tweet, void>(TwitterEvents.CREATE_TWEET, async (reqObj, resp) => {
  TwitterService.handleCreateTweet(reqObj, resp).catch((e) => {
    twitterLogger.error(
      `Error occurred in createTweet event (${reqObj.source}), Error: ${e.message}`,
    );
  });
});

onNetPromise<{ tweetId: number }, void>(TwitterEvents.DELETE_TWEET, async (reqObj, resp) => {
  const _source = getSource();
  TwitterService.handleDeleteTweet(reqObj, resp).catch((e) => {
    twitterLogger.error(`Error occurred in deleteTweet event (${_source}), Error: ${e.message}`);
  });
});

onNetPromise<{ tweetId: number }, void>(TwitterEvents.TOGGLE_LIKE, async (reqObj, resp) => {
  const _source = getSource();
  TwitterService.handleToggleLike(reqObj, resp).catch((e) => {
    twitterLogger.error(`Error occurred in toggleEvent event (${_source}), Error: ${e.message}`);
  });
});

onNetPromise<{ tweetId: number }, void>(TwitterEvents.RETWEET, async (reqObj, resp) => {
  const _source = getSource();
  TwitterService.handleRetweet(reqObj, resp).catch((e) =>
    twitterLogger.error(`Error occurred in retweet event (${_source}), Error: ${e.message}`),
  );
});

onNetPromise<{ tweetId: number }, void>(TwitterEvents.REPORT, async (reqObj, resp) => {
  const _source = getSource();
  TwitterService.handleReport(reqObj, resp).catch((e) =>
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
