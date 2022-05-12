import { RegisterNuiProxy } from './cl_utils';
import { ChannelMessageProps, DarkchatEvents, UpdateLabelDto } from '@typings/darkchat';
import { sendMessage } from '../utils/messages';

RegisterNuiProxy(DarkchatEvents.FETCH_CHANNELS);
RegisterNuiProxy(DarkchatEvents.FETCH_MESSAGES);
RegisterNuiProxy(DarkchatEvents.ADD_CHANNEL);
RegisterNuiProxy(DarkchatEvents.SEND_MESSAGE);
RegisterNuiProxy(DarkchatEvents.LEAVE_CHANNEL);
RegisterNuiProxy(DarkchatEvents.UPDATE_CHANNEL_LABEL);

onNet(DarkchatEvents.BROADCAST_MESSAGE, (data: ChannelMessageProps) => {
  sendMessage('DARKCHAT', DarkchatEvents.BROADCAST_MESSAGE, data);
});

onNet(DarkchatEvents.BROADCAST_LABEL_UPDATE, (data: UpdateLabelDto) => {
  sendMessage('DARKCHAT', DarkchatEvents.BROADCAST_LABEL_UPDATE, data);
});
