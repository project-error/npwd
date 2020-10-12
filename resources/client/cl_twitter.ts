import events from '../utils/events';
import { sendTwitterMessage } from '../utils/messages';

RegisterNuiCallbackType(events.TWITTER_FETCH_TWEETS);
on(`__cfx_nui:${events.TWITTER_FETCH_TWEETS}`, () => {
    emitNet(events.TWITTER_FETCH_TWEETS);
});

onNet(events.TWITTER_FETCH_TWEETS_SUCCESS, (results: any) => {
    sendTwitterMessage(events.TWITTER_FETCH_TWEETS_SUCCESS, results);
});

onNet(events.TWITTER_FETCH_TWEETS_FAILURE, () => {
    sendTwitterMessage(events.TWITTER_FETCH_TWEETS_FAILURE);
});