import { RegisterNuiProxy } from './cl_utils';
import {
  ChannelMessageProps,
  DarkchatEvents,
  OwnerTransferResp,
  UpdateLabelDto,
} from '@typings/darkchat';
import { sendMessage } from '../utils/messages';

RegisterNuiProxy(DarkchatEvents.FETCH_CHANNELS);
RegisterNuiProxy(DarkchatEvents.FETCH_MESSAGES);
RegisterNuiProxy(DarkchatEvents.ADD_CHANNEL);
RegisterNuiProxy(DarkchatEvents.SEND_MESSAGE);
RegisterNuiProxy(DarkchatEvents.LEAVE_CHANNEL);
RegisterNuiProxy(DarkchatEvents.UPDATE_CHANNEL_LABEL);
RegisterNuiProxy(DarkchatEvents.FETCH_MEMBERS);
RegisterNuiProxy(DarkchatEvents.TRANSFER_OWNERSHIP);
RegisterNuiProxy(DarkchatEvents.DELETE_CHANNEL);

onNet(DarkchatEvents.BROADCAST_MESSAGE, (data: ChannelMessageProps) => {
  sendMessage('DARKCHAT', DarkchatEvents.BROADCAST_MESSAGE, data);
});

onNet(DarkchatEvents.BROADCAST_LABEL_UPDATE, (data: UpdateLabelDto) => {
  sendMessage('DARKCHAT', DarkchatEvents.BROADCAST_LABEL_UPDATE, data);
});

onNet(DarkchatEvents.TRANSFER_OWNERSHIP_SUCCESS, (dto: OwnerTransferResp) => {
  sendMessage('DARKCHAT', DarkchatEvents.TRANSFER_OWNERSHIP_SUCCESS, dto);
});

onNet(DarkchatEvents.DELETE_CHANNEL_SUCCESS, (dto: any) => {
  sendMessage('DARKCHAT', DarkchatEvents.DELETE_CHANNEL_SUCCESS, dto);
});
