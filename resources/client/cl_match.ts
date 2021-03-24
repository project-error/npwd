import { Like, Profile, MatchEvents } from '../../typings/match';
import { sendMatchEvent } from '../utils/messages';

/**
 * Many events that are just statuses are passed directly from
 * the server to NUI and the client is just acting as a middle man.
 * For those cases this function allows us to simply transfer all the
 * data associated with the event.
 * @param eventName - event we are propagating
 */
const transferEvent = (eventName: string) => (...args: any) => {
  sendMatchEvent(eventName, ...args);
};

onNet(MatchEvents.GET_PROFILES_FAILED, transferEvent(MatchEvents.GET_PROFILES_FAILED));
onNet(MatchEvents.SAVE_LIKES_SUCCESS, transferEvent(MatchEvents.SAVE_LIKES_SUCCESS));
onNet(MatchEvents.SAVE_LIKES_FAILED, transferEvent(MatchEvents.SAVE_LIKES_FAILED));
onNet(MatchEvents.GET_MATCHES_SUCCESS, transferEvent(MatchEvents.GET_MATCHES_SUCCESS));
onNet(MatchEvents.GET_MATCHES_FAILED, transferEvent(MatchEvents.GET_MATCHES_FAILED));
onNet(MatchEvents.GET_MY_PROFILE_SUCCESS, transferEvent(MatchEvents.GET_MY_PROFILE_SUCCESS));
onNet(MatchEvents.GET_MY_PROFILE_FAILED, transferEvent(MatchEvents.GET_MY_PROFILE_FAILED));
onNet(MatchEvents.GET_PROFILES_SUCCESS, transferEvent(MatchEvents.GET_PROFILES_SUCCESS));
onNet(MatchEvents.UPDATE_MY_PROFILE_SUCCESS, transferEvent(MatchEvents.UPDATE_MY_PROFILE_SUCCESS));
onNet(MatchEvents.CREATE_MY_PROFILE_SUCCESS, transferEvent(MatchEvents.CREATE_MY_PROFILE_SUCCESS));
onNet(MatchEvents.CREATE_MY_PROFILE_FAILED, transferEvent(MatchEvents.CREATE_MY_PROFILE_FAILED));
onNet(MatchEvents.UPDATE_MY_PROFILE_FAILED, transferEvent(MatchEvents.UPDATE_MY_PROFILE_FAILED));
onNet(MatchEvents.NEW_MATCH, transferEvent(MatchEvents.NEW_MATCH));

RegisterNuiCallbackType(MatchEvents.SAVE_LIKES);
on(`__cfx_nui:${MatchEvents.SAVE_LIKES}`, (likes: Like[], cb: Function) => {
  emitNet(MatchEvents.SAVE_LIKES, likes);
  cb();
});

RegisterNuiCallbackType(MatchEvents.GET_MATCHES);
on(`__cfx_nui:${MatchEvents.GET_MATCHES}`, () => {
  emitNet(MatchEvents.GET_MATCHES);
});

RegisterNuiCallbackType(MatchEvents.INITIALIZE);
on(`__cfx_nui:${MatchEvents.INITIALIZE}`, () => {
  emitNet(MatchEvents.INITIALIZE);
});

RegisterNuiCallbackType(MatchEvents.CREATE_MY_PROFILE);
on(`__cfx_nui:${MatchEvents.CREATE_MY_PROFILE}`, (profile: Profile) => {
  emitNet(MatchEvents.CREATE_MY_PROFILE, profile);
});

RegisterNuiCallbackType(MatchEvents.UPDATE_MY_PROFILE);
on(`__cfx_nui:${MatchEvents.UPDATE_MY_PROFILE}`, (profile: Profile) => {
  emitNet(MatchEvents.UPDATE_MY_PROFILE, profile);
});
