import { useDarkchatActions } from './useDarkchatActions';
import fetchNui from '@utils/fetchNui';
import {
  ChannelItemProps,
  ChannelMember,
  ChannelMessageProps,
  DarkchatEvents,
  JoinChannelDTO,
  MessageDTO,
  OwnerTransferReq,
  OwnerTransferResp,
  UpdateLabelDto,
} from '@typings/darkchat';
import { ServerPromiseResp } from '@typings/common';
import { MockChannelMembers, MockChannelMessagesResp } from '../utils/constants';
import { useHistory } from 'react-router-dom';
import { useSetDarkchatMessagesState } from '../state/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { buildRespObj } from '@utils/misc';
import { DarkChatThemeProvider } from '../providers/DarkChatThemeProvider';

interface DarkchatAPIProps {
  addChannel: (channelDto: JoinChannelDTO) => void;
  leaveChannel: (id: number) => void;
  fetchMessages: (conversationId: number) => void;
  sendMessage: (dto: MessageDTO) => void;
  updateChannelLabel: (dto: UpdateLabelDto) => void;
  transferOwnership: (channelId: number, identifier: string, phoneNumber: string) => void;
  fetchMembers: (conversationId: number) => void;
  deleteChannel: (id: number) => void;
}

export const useDarkchatAPI = (): DarkchatAPIProps => {
  const {
    addLocalChannel,
    addLocalMessage,
    leaveLocalChannel,
    updateLocalChannelLabel,
    localTransferOwner,
    addLocalMembers,
  } = useDarkchatActions();
  const history = useHistory();
  const setMessages = useSetDarkchatMessagesState();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const fetchMembers = (conversationId: number) => {
    fetchNui<ServerPromiseResp<ChannelMember[]>>(
      DarkchatEvents.FETCH_MEMBERS,
      { channelId: conversationId },
      buildRespObj(MockChannelMembers),
    ).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('DARKCHAT.FEEDBACK.FETCH_MEMBERS_FAILED'),
        });
      }

      addLocalMembers(resp.data);
    });
  };

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

  const transferOwnership = (channelId: number, identifier: string, phoneNumber: string) => {
    fetchNui<ServerPromiseResp<OwnerTransferResp>, OwnerTransferReq>(
      DarkchatEvents.TRANSFER_OWNERSHIP,
      {
        userIdentifier: identifier,
        channelId,
        newOwnerPhoneNumber: phoneNumber,
      },
    ).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('DARKCHAT.FEEDBACK.TRANSFER_OWNERSHIP_FAILED'),
        });
      }

      localTransferOwner(resp.data);
      history.push('/darkchat');
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

  const deleteChannel = (channelId: number) => {
    fetchNui<ServerPromiseResp<{ channelId: number }>>(DarkchatEvents.DELETE_CHANNEL, {
      channelId,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('DARKCHAT.FEEDBACK.DELETE_CHANNEL_FAILED'),
        });
      }

      leaveLocalChannel(channelId);
    });
  };

  return {
    addChannel,
    fetchMessages,
    sendMessage,
    leaveChannel,
    updateChannelLabel,
    transferOwnership,
    fetchMembers,
    deleteChannel,
  };
};
