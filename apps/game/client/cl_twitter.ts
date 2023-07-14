import { TwitterEvents } from '@typings/twitter';
import { sendTwitterMessage } from '../utils/messages';
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

onNet(TwitterEvents.CREATE_TWEET_BROADCAST, (tweet: any) => {
  sendTwitterMessage(TwitterEvents.CREATE_TWEET_BROADCAST, tweet);
});

onNet(TwitterEvents.TWEET_LIKED_BROADCAST, (
  tweetId: number,
  isAddLike: boolean,
  likedByProfileName: string
) => {
  sendTwitterMessage(TwitterEvents.TWEET_LIKED_BROADCAST, {tweetId, isAddLike, likedByProfileName});
});
