import { TwitterEvents } from '../../typings/twitter';
import { sendTwitterMessage } from '../utils/messages';
import { IAlertProps } from '../../typings/alerts';
import { RegisterNuiProxy } from './cl_utils';

/**
 * Twitter get or create profile
 */
RegisterNuiCallbackType(TwitterEvents.GET_OR_CREATE_PROFILE);
on(`__cfx_nui:${TwitterEvents.GET_OR_CREATE_PROFILE}`, () => {
  emitNet(TwitterEvents.GET_OR_CREATE_PROFILE);
});

onNet(TwitterEvents.GET_OR_CREATE_PROFILE_SUCCESS, (profile: any) => {
  sendTwitterMessage(TwitterEvents.GET_OR_CREATE_PROFILE, profile);
});

onNet(TwitterEvents.GET_OR_CREATE_PROFILE_FAILURE, () => {
  sendTwitterMessage(TwitterEvents.GET_OR_CREATE_PROFILE_FAILURE);
});

onNet(TwitterEvents.GET_OR_CREATE_PROFILE_NULL, (defaultProfileNames: string[]): void => {
  sendTwitterMessage(TwitterEvents.GET_OR_CREATE_PROFILE_NULL, defaultProfileNames);
});

/**
 * Twitter create profile
 */
RegisterNuiCallbackType(TwitterEvents.CREATE_PROFILE);
on(`__cfx_nui:${TwitterEvents.CREATE_PROFILE}`, (data: any) => {
  sendTwitterMessage(TwitterEvents.UPDATE_PROFILE_LOADING, true);
  emitNet(TwitterEvents.CREATE_PROFILE, data);
});

onNet(TwitterEvents.CREATE_PROFILE_RESULT, (alert: IAlertProps) => {
  sendTwitterMessage(TwitterEvents.CREATE_PROFILE_RESULT, alert);
  sendTwitterMessage(TwitterEvents.UPDATE_PROFILE_LOADING, false);
  emitNet(TwitterEvents.GET_OR_CREATE_PROFILE);
});

/**
 * Twitter update profile
 */
RegisterNuiCallbackType(TwitterEvents.UPDATE_PROFILE);
on(`__cfx_nui:${TwitterEvents.UPDATE_PROFILE}`, (data: string) => {
  sendTwitterMessage(TwitterEvents.UPDATE_PROFILE_LOADING, true);
  emitNet(TwitterEvents.UPDATE_PROFILE, data);
});

onNet(TwitterEvents.UPDATE_PROFILE_RESULT, (alert: IAlertProps) => {
  sendTwitterMessage(TwitterEvents.UPDATE_PROFILE_RESULT, alert);
  sendTwitterMessage(TwitterEvents.UPDATE_PROFILE_LOADING, false);
  emitNet(TwitterEvents.GET_OR_CREATE_PROFILE);
});

/**
 * Twitter fetch tweets
 */
RegisterNuiProxy(TwitterEvents.FETCH_TWEETS);

/*
onNet(TwitterEvents.FETCH_TWEETS_SUCCESS, (tweets: any) => {
  sendTwitterMessage(TwitterEvents.FETCH_TWEETS, tweets);
});

onNet(TwitterEvents.FETCH_TWEETS_FAILURE, () => {
  sendTwitterMessage(TwitterEvents.FETCH_TWEETS_FAILURE);
});
*/

//kept for now, will need to remove later  ^^

/**
 * Twitter fetch filtered tweets
 */
RegisterNuiCallbackType(TwitterEvents.FETCH_TWEETS_FILTERED);
on(`__cfx_nui:${TwitterEvents.FETCH_TWEETS_FILTERED}`, (searchValue: string) => {
  emitNet(TwitterEvents.FETCH_TWEETS_FILTERED, searchValue);
});

onNet(TwitterEvents.FETCH_TWEETS_FILTERED_SUCCESS, (tweets: any) => {
  sendTwitterMessage(TwitterEvents.FETCH_TWEETS_FILTERED_SUCCESS, tweets);
});

onNet(TwitterEvents.FETCH_TWEETS_FILTERED_FAILURE, () => {
  sendTwitterMessage(TwitterEvents.FETCH_TWEETS_FILTERED_FAILURE);
});

/**
 * Twitter create tweet
 */
RegisterNuiCallbackType(TwitterEvents.CREATE_TWEET);
on(`__cfx_nui:${TwitterEvents.CREATE_TWEET}`, (data: string) => {
  sendTwitterMessage(TwitterEvents.CREATE_TWEET_LOADING, true);
  emitNet(TwitterEvents.CREATE_TWEET, data);
});

onNet(TwitterEvents.CREATE_TWEET_RESULT, (alert: IAlertProps) => {
  sendTwitterMessage(TwitterEvents.CREATE_TWEET_RESULT, alert);
  emitNet(TwitterEvents.FETCH_TWEETS);
});

onNet(TwitterEvents.CREATE_TWEET_FAILURE, () => {
  sendTwitterMessage(TwitterEvents.CREATE_TWEET_FAILURE);
});

onNet(TwitterEvents.CREATE_TWEET_BROADCAST, (tweet: any) => {
  sendTwitterMessage(TwitterEvents.CREATE_TWEET_BROADCAST, tweet);
});

/**
 * Twitter delete tweet
 */
RegisterNuiCallbackType(TwitterEvents.DELETE_TWEET);
on(`__cfx_nui:${TwitterEvents.DELETE_TWEET}`, (tweetId: number) => {
  emitNet(TwitterEvents.DELETE_TWEET, tweetId);
});

onNet(TwitterEvents.DELETE_TWEET_SUCCESS, () => {
  sendTwitterMessage(TwitterEvents.DELETE_TWEET_SUCCESS);
  emitNet(TwitterEvents.FETCH_TWEETS);
});

onNet(TwitterEvents.DELETE_TWEET_FAILURE, () => {
  sendTwitterMessage(TwitterEvents.DELETE_TWEET_FAILURE);
});

/**
 * Twitter likes
 */
RegisterNuiCallbackType(TwitterEvents.TOGGLE_LIKE);
on(`__cfx_nui:${TwitterEvents.TOGGLE_LIKE}`, (tweetId: number) => {
  emitNet(TwitterEvents.TOGGLE_LIKE, tweetId);
});

/**
 * Twitter retweets
 */
RegisterNuiCallbackType(TwitterEvents.RETWEET);
on(`__cfx_nui:${TwitterEvents.RETWEET}`, (tweetId: number, cb: Function) => {
  emitNet(TwitterEvents.RETWEET, tweetId);
  cb();
});

onNet(TwitterEvents.RETWEET_EXISTS, (alert: IAlertProps) => {
  sendTwitterMessage(TwitterEvents.RETWEET_EXISTS, alert);
});

/**
 * Twitter reporting tweets
 */
RegisterNuiCallbackType(TwitterEvents.REPORT);
on(`__cfx_nui:${TwitterEvents.REPORT}`, (tweetId: number) => {
  emitNet(TwitterEvents.REPORT, tweetId);
});

onNet(TwitterEvents.REPORT_SUCCESS, () => {
  emitNet(TwitterEvents.FETCH_TWEETS);
});
