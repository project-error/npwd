import events from '../utils/events';
import { Like } from '../../typings/match';
import { sendMatchEvent } from '../utils/messages';

const transferEvent = (eventName: string) => (...args: any) => {
  sendMatchEvent(eventName, ...args);
};

onNet(events.MATCH_GET_MY_PROFILE_SUCCESS, transferEvent(events.MATCH_GET_MY_PROFILE_SUCCESS));
onNet(events.MATCH_GET_MY_PROFILE_FAILED, transferEvent(events.MATCH_GET_MY_PROFILE_FAILED));
onNet(events.MATCH_GET_PROFILES_SUCCESS, transferEvent(events.MATCH_GET_PROFILES_SUCCESS));
onNet(events.MATCH_GET_PROFILES_FAILED, transferEvent(events.MATCH_GET_PROFILES_FAILED));
onNet(events.MATCH_SAVE_LIKES_SUCCESS, transferEvent(events.MATCH_SAVE_LIKES_SUCCESS));
onNet(events.MATCH_SAVE_LIKES_FAILED, transferEvent(events.MATCH_SAVE_LIKES_FAILED));
onNet(events.MATCH_GET_MATCHES_SUCCESS, transferEvent(events.MATCH_GET_MATCHES_SUCCESS));
onNet(events.MATCH_GET_MATCHES_FAILED, transferEvent(events.MATCH_GET_MATCHES_FAILED));
onNet(events.MATCH_NEW_MATCH, transferEvent(events.MATCH_NEW_MATCH));

RegisterNuiCallbackType(events.MATCH_SAVE_LIKES);
on(`__cfx_nui:${events.MATCH_SAVE_LIKES}`, (likes: Like[], cb: Function) => {
  emitNet(events.MATCH_SAVE_LIKES, likes);
  cb();
});

RegisterNuiCallbackType(events.MATCH_GET_MATCHES);
on(`__cfx_nui:${events.MATCH_GET_MATCHES}`, () => {
  emitNet(events.MATCH_GET_MATCHES);
});
