import { CreateMatchBroadcast, FormattedProfile, MatchEvents } from '@typings/match';
import { sendMatchEvent } from '../utils/messages';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(MatchEvents.GET_PROFILES);
RegisterNuiProxy(MatchEvents.GET_MY_PROFILE);
RegisterNuiProxy(MatchEvents.GET_MATCHES);
RegisterNuiProxy(MatchEvents.SAVE_LIKES);
RegisterNuiProxy(MatchEvents.CREATE_MY_PROFILE);
RegisterNuiProxy(MatchEvents.UPDATE_MY_PROFILE);

onNet(MatchEvents.SAVE_LIKES_BROADCAST, (result: CreateMatchBroadcast) => {
  sendMatchEvent(MatchEvents.SAVE_LIKES_BROADCAST, result);
});

onNet(MatchEvents.CREATE_MATCH_ACCOUNT_BROADCAST, (result: FormattedProfile) => {
  sendMatchEvent(MatchEvents.CREATE_MATCH_ACCOUNT_BROADCAST, result);
});
