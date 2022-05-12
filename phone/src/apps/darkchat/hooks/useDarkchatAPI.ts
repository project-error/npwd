import { useDarkchatActions } from './useDarkchatActions';
import fetchNui from '@utils/fetchNui';
import {
  ChannelItemProps,
  ChannelMessageProps,
  DarkchatEvents,
  JoinChannelDTO,
  MessageDTO,
  UpdateLabelDto,
} from '@typings/darkchat';
import { ServerPromiseResp } from '@typings/common';
import { MockChannelMessagesResp } from '../utils/constants';
import { useHistory } from 'react-router-dom';
import { useSetDarkchatMessagesState } from '../state/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

interface DarkchatAPIProps {
  addChannel: (channelDto: JoinChannelDTO) => void;
  leaveChannel: (id: number) => void;
  fetchMessages: (conversationId: number) => void;
  sendMessage: (dto: MessageDTO) => void;
  updateChannelLabel: (dto: UpdateLabelDto) => void;
}

export const useDarkchatAPI = (): DarkchatAPIProps => {
  const { addLocalChannel, addLocalMessage, leaveLocalChannel, updateLocalChannelLabel } =
    useDarkchatActions();
  const history = useHistory();
  const setMessages = useSetDarkchatMessagesState();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const addChannel = (channelDto: JoinChannelDTO) => {
    fetchNui<ServerPromiseResp<ChannelItemProps>, JoinChannelDTO>(DarkchatEvents.ADD_CHANNEL, {
      channelIdentifier: channelDto.channelIdentifier,
      label: channelDto.label,
    }).then((res) => {
      if (res.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('DARKCHAT.FEEDBACK.JOIN_CHANNEL_FAILED'),
        });
      }

      addLocalChannel(res.data);
    });
  };

  const leaveChannel = (id: number) => {
    fetchNui<ServerPromiseResp<{ channelId: number }>>(DarkchatEvents.LEAVE_CHANNEL, {
      channelId: id,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('DARKCHAT.FEEDBACK.LEAVE_CHANNEL_FAILED'),
        });
      }

      leaveLocalChannel(id);
      history.goBack();
    });
  };

  const fetchMessages = (conversationId: number) => {
    fetchNui<ServerPromiseResp<ChannelMessageProps[]>>(
      DarkchatEvents.FETCH_MESSAGES,
      { channelId: conversationId },
      MockChannelMessagesResp,
    ).then((res) => {
      if (res.status !== 'ok') {
        addAlert({
          type: 'error',
          message: t('DARKCHAT.FEEDBACK.FETCH_MESSAGES_FAILED'),
        });
        return history.push('/darkchat');
      }

      setMessages(res.data);
    });
  };

  const sendMessage = (dto: MessageDTO) => {
    fetchNui<ServerPromiseResp<ChannelMessageProps>, MessageDTO>(
      DarkchatEvents.SEND_MESSAGE,
      dto,
    ).then((res) => {
      if (res.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('DARKCHAT.FEEDBACK.SEND_MESSAGE_FAILED'),
        });
      }

      addLocalMessage(res.data);
    });
  };

  const updateChannelLabel = (dto: UpdateLabelDto) => {
    fetchNui<ServerPromiseResp<UpdateLabelDto>>(DarkchatEvents.UPDATE_CHANNEL_LABEL, dto).then(
      (resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            type: 'error',
            message: t('DARKCHAT.FEEDBACK.UPDATE_LABEL_FAILED'),
          });
        }

        updateLocalChannelLabel(dto);
      },
    );
  };

  return { addChannel, fetchMessages, sendMessage, leaveChannel, updateChannelLabel };
};
