import { TwitterEvents } from '../../typings/twitter';
import { sendTwitterMessage } from '../utils/messages';
import { IAlertProps } from '../../typings/alerts';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(TwitterEvents.GET_OR_CREATE_PROFILE);
RegisterNuiProxy(TwitterEvents.DELETE_TWEET);
RegisterNuiProxy(TwitterEvents.UPDATE_PROFILE);
RegisterNuiProxy(TwitterEvents.CREATE_PROFILE);
RegisterNuiProxy(TwitterEvents.FETCH_TWEETS);
RegisterNuiProxy(TwitterEvents.CREATE_TWEET);
RegisterNuiProxy(TwitterEvents.FETCH_TWEETS_FILTERED);
RegisterNuiProxy(TwitterEvents.TOGGLE_LIKE);
RegisterNuiProxy(TwitterEvents.REPORT);
RegisterNuiProxy(TwitterEvents.RETWEET);

onNet(TwitterEvents.GET_OR_CREATE_PROFILE_SUCCESS, (profile: any) => {
  sendTwitterMessage(TwitterEvents.GET_OR_CREATE_PROFILE, profile);
});

// remove and replace with alert when status is 'error'
onNet(TwitterEvents.GET_OR_CREATE_PROFILE_FAILURE, () => {
  sendTwitterMessage(TwitterEvents.GET_OR_CREATE_PROFILE_FAILURE);
});

// remove and replace with alert
onNet(TwitterEvents.GET_OR_CREATE_PROFILE_NULL, (defaultProfileNames: string[]): void => {
  sendTwitterMessage(TwitterEvents.GET_OR_CREATE_PROFILE_NULL, defaultProfileNames);
});

// remove and replace with alert when status is 'error'
onNet(TwitterEvents.CREATE_TWEET_RESULT, (alert: IAlertProps) => {
  sendTwitterMessage(TwitterEvents.CREATE_TWEET_RESULT, alert);
  emitNet(TwitterEvents.FETCH_TWEETS);
});

onNet(TwitterEvents.CREATE_TWEET_BROADCAST, (tweet: any) => {
  sendTwitterMessage(TwitterEvents.CREATE_TWEET_BROADCAST, tweet);
});

// remove and replace with alert
onNet(TwitterEvents.RETWEET_EXISTS, (alert: IAlertProps) => {
  sendTwitterMessage(TwitterEvents.RETWEET_EXISTS, alert);
});
