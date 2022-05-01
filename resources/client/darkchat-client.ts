import { RegisterNuiProxy } from './cl_utils';
import { ChannelMessageProps, DarkchatEvents } from '@typings/darkchat';
import { sendMessage } from '../utils/messages';

RegisterNuiProxy(DarkchatEvents.FETCH_CHANNELS);
RegisterNuiProxy(DarkchatEvents.FETCH_MESSAGES);
RegisterNuiProxy(DarkchatEvents.ADD_CHANNEL);
RegisterNuiProxy(DarkchatEvents.SEND_MESSAGE);

onNet(DarkchatEvents.BROADCAST_MESSAGE, (data: ChannelMessageProps) => {
  sendMessage('DARKCHAT', DarkchatEvents.BROADCAST_MESSAGE, data);
});
