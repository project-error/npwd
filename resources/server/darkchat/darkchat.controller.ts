import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import {
  ChannelItemProps,
  ChannelMessageProps,
  DarkchatEvents,
  JoinChannelDTO,
  MessageDTO,
  UpdateLabelDto,
} from '../../../typings/darkchat';
import DarkchatService from './darkchat.service';
import { darkchatLogger } from './darkchat.utils';

onNetPromise<void, ChannelItemProps[]>(DarkchatEvents.FETCH_CHANNELS, async (reqObj, resp) => {
  await DarkchatService.handleGetAllChannels(reqObj, resp).catch((err) => {
    darkchatLogger.error(
      `Error occurred in fetch channels event (${reqObj.source}). Error: ${err.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<{ channelId: number }, ChannelMessageProps[]>(
  DarkchatEvents.FETCH_MESSAGES,
  async (reqObj, resp) => {
    DarkchatService.handleGetChannelMessage(reqObj, resp).catch((err) => {
      darkchatLogger.error(
        `Error occurred in fetch channel messages (${reqObj.source}). Error: ${err.message}`,
      );
    });
  },
);

onNetPromise<JoinChannelDTO, ChannelItemProps>(DarkchatEvents.ADD_CHANNEL, async (reqObj, resp) => {
  DarkchatService.handleJoinChannel(reqObj, resp).catch((err) => {
    darkchatLogger.error(
      `Error occurred in join channel event (${reqObj.source}). Error: ${err.message}`,
    );
  });
});

onNetPromise<MessageDTO, ChannelMessageProps>(DarkchatEvents.SEND_MESSAGE, async (reqObj, resp) => {
  DarkchatService.handleCreateMessage(reqObj, resp).catch((err) => {
    darkchatLogger.error(
      `Error occurred in send message event (${reqObj.source}). Error: ${err.message}`,
    );
  });
});

onNetPromise<{ channelId: number }, void>(DarkchatEvents.LEAVE_CHANNEL, async (reqObj, resp) => {
  DarkchatService.handleLeaveChannel(reqObj, resp).catch((err) => {
    darkchatLogger.error(
      `Error occurred in leave channel event (${reqObj.source}). Error: ${err.message}`,
    );
  });
});

onNetPromise<UpdateLabelDto, void>(DarkchatEvents.UPDATE_CHANNEL_LABEL, async (reqObj, resp) => {
  DarkchatService.handleUpdateChannelLabel(reqObj, resp).catch((err) => {
    darkchatLogger.error(
      `Error occurred in update channel label event (${reqObj.source}). Error: ${err.message}`,
    );
  });
});
