import {
  CreateMessageBroadcast,
  MakeGroupOwner,
  MessageConversationResponse,
  MessageEvents,
  PreDBMessage,
  RemoveGroupMemberResponse,
} from '../../typings/messages';
import { sendMessageEvent } from '../utils/messages';
import { RegisterNuiProxy, RegisterNuiCB } from './cl_utils';

RegisterNuiProxy(MessageEvents.FETCH_MESSAGE_CONVERSATIONS);
RegisterNuiProxy(MessageEvents.DELETE_MESSAGE);
RegisterNuiProxy(MessageEvents.FETCH_MESSAGES);
RegisterNuiProxy(MessageEvents.CREATE_MESSAGE_CONVERSATION);
RegisterNuiProxy(MessageEvents.DELETE_CONVERSATION);
RegisterNuiProxy(MessageEvents.DELETE_GROUP_MEMBER);
RegisterNuiProxy(MessageEvents.MAKE_GROUP_OWNER);
RegisterNuiProxy(MessageEvents.SEND_MESSAGE);
RegisterNuiProxy(MessageEvents.SET_MESSAGE_READ);
RegisterNuiProxy(MessageEvents.GET_MESSAGE_LOCATION);

RegisterNuiCB(MessageEvents.MESSAGES_SET_WAYPOINT, ({ coords }: { coords: number[] }) => {
  SetNewWaypoint(coords[0], coords[1]);
});

onNet(MessageEvents.SEND_MESSAGE_SUCCESS, (messageDto: PreDBMessage) => {
  sendMessageEvent(MessageEvents.SEND_MESSAGE_SUCCESS, messageDto);
});

onNet(MessageEvents.CREATE_MESSAGE_BROADCAST, (result: CreateMessageBroadcast) => {
  sendMessageEvent(MessageEvents.CREATE_MESSAGE_BROADCAST, result);
});

onNet(MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, (result: MessageConversationResponse) => {
  sendMessageEvent(MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, result);
});

onNet(MessageEvents.DELETE_GROUP_MEMBER_CONVERSATION, (result: number[]) => {
  sendMessageEvent(MessageEvents.DELETE_GROUP_MEMBER_CONVERSATION, result);
});

onNet(MessageEvents.DELETE_GROUP_MEMBER_LIST, (result: RemoveGroupMemberResponse) => {
  sendMessageEvent(MessageEvents.DELETE_GROUP_MEMBER_LIST, result);
});

onNet(MessageEvents.UPDATE_GROUP_OWNER, (result: MakeGroupOwner) => {
  sendMessageEvent(MessageEvents.UPDATE_GROUP_OWNER, result);
});
