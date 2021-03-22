import events from '../utils/events';
import { sendMatchEvent } from '../utils/messages';
import { IAlertProps } from '../../typings/alerts';

const transferEvent = (eventName: string) => (...args: any) => {
  sendMatchEvent(eventName, ...args);
};

onNet(events.MATCH_GET_MY_PROFILE_SUCCESS, transferEvent(events.MATCH_GET_MY_PROFILE_SUCCESS));
onNet(events.MATCH_GET_MY_PROFILE_FAILED, transferEvent(events.MATCH_GET_MY_PROFILE_FAILED));
onNet(events.MATCH_GET_PROFILES_SUCCESS, transferEvent(events.MATCH_GET_PROFILES_SUCCESS));
onNet(events.MATCH_GET_PROFILES_FAILED, transferEvent(events.MATCH_GET_PROFILES_FAILED));
