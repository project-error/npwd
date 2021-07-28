import { Like, Profile, MatchEvents, FormattedProfile } from '../../typings/match';
import { sendMatchEvent } from '../utils/messages';
import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';
import { onNetPromise } from '../server/utils/PromiseNetEvents/onNetPromise';
import { ClUtils } from './client';

/**
 * Many events that are just statuses are passed directly from
 * the server to NUI and the client is just acting as a middle man.
 * For those cases this function allows us to simply transfer all the
 * data associated with the event.
 * @param eventName - event we are propagating
 */
const transferEvent =
  (eventName: string) =>
  (...args: any) => {
    sendMatchEvent(eventName, ...args);
  };

RegisterNuiProxy(MatchEvents.GET_PROFILES);
RegisterNuiProxy(MatchEvents.GET_MY_PROFILE);
RegisterNuiProxy(MatchEvents.GET_MATCHES);

RegisterNuiCB<Like[]>(MatchEvents.SAVE_LIKES, async (likes, cb) => {
  const resp = await ClUtils.emitNetPromise<boolean>(MatchEvents.SAVE_LIKES, likes);
  cb({ resp });
});

RegisterNuiCB<Profile>(MatchEvents.CREATE_MY_PROFILE, async (profile, cb) => {
  const resp = await ClUtils.emitNetPromise<FormattedProfile>(
    MatchEvents.CREATE_MY_PROFILE,
    profile,
  );
  cb({ resp });
});

RegisterNuiCB<Profile>(MatchEvents.UPDATE_MY_PROFILE, async (profile, cb) => {
  const resp = await ClUtils.emitNetPromise<FormattedProfile>(
    MatchEvents.UPDATE_MY_PROFILE,
    profile,
  );
  cb({ resp });
});

/*onNet(MatchEvents.UPDATE_MY_PROFILE_SUCCESS, transferEvent(MatchEvents.UPDATE_MY_PROFILE_SUCCESS));
onNet(MatchEvents.CREATE_MY_PROFILE_SUCCESS, transferEvent(MatchEvents.CREATE_MY_PROFILE_SUCCESS));
onNet(MatchEvents.CREATE_MY_PROFILE_FAILED, transferEvent(MatchEvents.CREATE_MY_PROFILE_FAILED));
onNet(MatchEvents.UPDATE_MY_PROFILE_FAILED, transferEvent(MatchEvents.UPDATE_MY_PROFILE_FAILED));*/

/*RegisterNuiCallbackType(MatchEvents.INITIALIZE);
on(`__cfx_nui:${MatchEvents.INITIALIZE}`, () => {
  emitNet(MatchEvents.INITIALIZE);
});

RegisterNuiCallbackType(MatchEvents.CREATE_MY_PROFILE);
on(`__cfx_nui:${MatchEvents.CREATE_MY_PROFILE}`, (profile: Profile) => {
  emitNet(MatchEvents.CREATE_MY_PROFILE, profile);
});*/

RegisterNuiCallbackType(MatchEvents.UPDATE_MY_PROFILE);
on(`__cfx_nui:${MatchEvents.UPDATE_MY_PROFILE}`, (profile: Profile) => {
  emitNet(MatchEvents.UPDATE_MY_PROFILE, profile);
});
