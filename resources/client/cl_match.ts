import { MatchEvents } from '../../typings/match';
import { RegisterNuiProxy } from './cl_utils';

RegisterNuiProxy(MatchEvents.GET_PROFILES);
RegisterNuiProxy(MatchEvents.GET_MY_PROFILE);
RegisterNuiProxy(MatchEvents.GET_MATCHES);
RegisterNuiProxy(MatchEvents.SAVE_LIKES);
RegisterNuiProxy(MatchEvents.CREATE_MY_PROFILE);
RegisterNuiProxy(MatchEvents.UPDATE_MY_PROFILE);
