import { Like, Profile, MatchEvents } from '../../typings/match';
import { sendMatchEvent } from '../utils/messages';

const transferEvent = (eventName: string) => (...args: any) => {
  sendMatchEvent(eventName, ...args);
};

onNet(MatchEvents.MATCH_GET_PROFILES_FAILED, transferEvent(MatchEvents.MATCH_GET_PROFILES_FAILED));
onNet(MatchEvents.MATCH_SAVE_LIKES_SUCCESS, transferEvent(MatchEvents.MATCH_SAVE_LIKES_SUCCESS));
onNet(MatchEvents.MATCH_SAVE_LIKES_FAILED, transferEvent(MatchEvents.MATCH_SAVE_LIKES_FAILED));
onNet(MatchEvents.MATCH_GET_MATCHES_SUCCESS, transferEvent(MatchEvents.MATCH_GET_MATCHES_SUCCESS));
onNet(MatchEvents.MATCH_GET_MATCHES_FAILED, transferEvent(MatchEvents.MATCH_GET_MATCHES_FAILED));
onNet(
  MatchEvents.MATCH_GET_MY_PROFILE_SUCCESS,
  transferEvent(MatchEvents.MATCH_GET_MY_PROFILE_SUCCESS),
);
onNet(
  MatchEvents.MATCH_GET_MY_PROFILE_FAILED,
  transferEvent(MatchEvents.MATCH_GET_MY_PROFILE_FAILED),
);
onNet(
  MatchEvents.MATCH_GET_PROFILES_SUCCESS,
  transferEvent(MatchEvents.MATCH_GET_PROFILES_SUCCESS),
);
onNet(
  MatchEvents.MATCH_UPDATE_MY_PROFILE_SUCCESS,
  transferEvent(MatchEvents.MATCH_UPDATE_MY_PROFILE_SUCCESS),
);
onNet(
  MatchEvents.MATCH_UPDATE_MY_PROFILE_FAILED,
  transferEvent(MatchEvents.MATCH_UPDATE_MY_PROFILE_FAILED),
);
onNet(MatchEvents.MATCH_NEW_MATCH, transferEvent(MatchEvents.MATCH_NEW_MATCH));

RegisterNuiCallbackType(MatchEvents.MATCH_SAVE_LIKES);
on(`__cfx_nui:${MatchEvents.MATCH_SAVE_LIKES}`, (likes: Like[], cb: Function) => {
  emitNet(MatchEvents.MATCH_SAVE_LIKES, likes);
  cb();
});

RegisterNuiCallbackType(MatchEvents.MATCH_GET_MATCHES);
on(`__cfx_nui:${MatchEvents.MATCH_GET_MATCHES}`, () => {
  emitNet(MatchEvents.MATCH_GET_MATCHES);
});

RegisterNuiCallbackType(MatchEvents.MATCH_INITIALIZE);
on(`__cfx_nui:${MatchEvents.MATCH_INITIALIZE}`, () => {
  emitNet(MatchEvents.MATCH_INITIALIZE);
});

RegisterNuiCallbackType(MatchEvents.MATCH_UPDATE_MY_PROFILE);
on(`__cfx_nui:${MatchEvents.MATCH_UPDATE_MY_PROFILE}`, (profile: Profile) => {
  emitNet(MatchEvents.MATCH_UPDATE_MY_PROFILE, profile);
});
