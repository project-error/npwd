import events from "../utils/events";
import { sendTwitterMessage } from "../utils/messages";

/**
 * Twitter get or create profile
 */
RegisterNuiCallbackType(events.TWITTER_GET_OR_CREATE_PROFILE);
on(`__cfx_nui:${events.TWITTER_GET_OR_CREATE_PROFILE}`, () => {
  emitNet(events.TWITTER_GET_OR_CREATE_PROFILE);
});

onNet(events.TWITTER_GET_OR_CREATE_PROFILE_SUCCESS, (profile: any) => {
  sendTwitterMessage(events.TWITTER_GET_OR_CREATE_PROFILE_SUCCESS, profile);
});

onNet(events.TWITTER_GET_OR_CREATE_PROFILE_FAILURE, () => {
  sendTwitterMessage(events.TWITTER_GET_OR_CREATE_PROFILE_FAILURE);
});

/**
 * Twitter update profile
 */
RegisterNuiCallbackType(events.TWITTER_UPDATE_PROFILE);
on(`__cfx_nui:${events.TWITTER_UPDATE_PROFILE}`, (data: string) => {
  sendTwitterMessage(events.TWITTER_UPDATE_PROFILE_LOADING, true);
  emitNet(events.TWITTER_UPDATE_PROFILE, data);
});

onNet(events.TWITTER_UPDATE_PROFILE_RESULT, (result: boolean) => {
  sendTwitterMessage(events.TWITTER_UPDATE_PROFILE_RESULT, result);
  emitNet(events.TWITTER_GET_OR_CREATE_PROFILE);
});

/**
 * Twitter fetch tweets
 */
RegisterNuiCallbackType(events.TWITTER_FETCH_TWEETS);
on(`__cfx_nui:${events.TWITTER_FETCH_TWEETS}`, () => {
  emitNet(events.TWITTER_FETCH_TWEETS);
});

onNet(events.TWITTER_FETCH_TWEETS_SUCCESS, (tweets: any) => {
  sendTwitterMessage(events.TWITTER_FETCH_TWEETS_SUCCESS, tweets);
});

onNet(events.TWITTER_FETCH_TWEETS_FAILURE, () => {
  sendTwitterMessage(events.TWITTER_FETCH_TWEETS_FAILURE);
});

/**
 * Twitter fetch filtered tweets
 */
RegisterNuiCallbackType(events.TWITTER_FETCH_TWEETS_FILTERED);
on(
  `__cfx_nui:${events.TWITTER_FETCH_TWEETS_FILTERED}`,
  (searchValue: string) => {
    emitNet(events.TWITTER_FETCH_TWEETS_FILTERED, searchValue);
  }
);

onNet(events.TWITTER_FETCH_TWEETS_FILTERED_SUCCESS, (tweets: any) => {
  sendTwitterMessage(events.TWITTER_FETCH_TWEETS_FILTERED_SUCCESS, tweets);
});

onNet(events.TWITTER_FETCH_TWEETS_FILTERED_FAILURE, () => {
  sendTwitterMessage(events.TWITTER_FETCH_TWEETS_FILTERED_FAILURE);
});

/**
 * Twitter create tweet
 */
RegisterNuiCallbackType(events.TWITTER_CREATE_TWEET);
on(`__cfx_nui:${events.TWITTER_CREATE_TWEET}`, (data: string) => {
  sendTwitterMessage(events.TWITTER_CREATE_TWEET_LOADING, true);
  emitNet(events.TWITTER_CREATE_TWEET, data);
});

onNet(events.TWITTER_CREATE_TWEET_RESULT, (result: boolean) => {
  sendTwitterMessage(events.TWITTER_CREATE_TWEET_RESULT, result);
  emitNet(events.TWITTER_FETCH_TWEETS);
});

onNet(events.TWITTER_CREATE_TWEET_FAILURE, () => {
  sendTwitterMessage(events.TWITTER_CREATE_TWEET_FAILURE);
});

onNet(events.TWITTER_CREATE_TWEET_BROADCAST, (tweet: any) => {
  sendTwitterMessage(events.TWITTER_CREATE_TWEET_BROADCAST, tweet);
});

/**
 * Twitter delete tweet
 */
RegisterNuiCallbackType(events.TWITTER_DELETE_TWEET);
on(`__cfx_nui:${events.TWITTER_DELETE_TWEET}`, (tweetId: number) => {
  emitNet(events.TWITTER_DELETE_TWEET, tweetId);
});

onNet(events.TWITTER_DELETE_TWEET_SUCCESS, () => {
  sendTwitterMessage(events.TWITTER_DELETE_TWEET_SUCCESS);
  emitNet(events.TWITTER_FETCH_TWEETS);
});

onNet(events.TWITTER_DELETE_TWEET_FAILURE, () => {
  sendTwitterMessage(events.TWITTER_DELETE_TWEET_FAILURE);
});

/**
 * Twitter likes
 */
RegisterNuiCallbackType(events.TWITTER_TOGGLE_LIKE);
on(`__cfx_nui:${events.TWITTER_TOGGLE_LIKE}`, (tweetId: number) => {
  emitNet(events.TWITTER_TOGGLE_LIKE, tweetId);
});
