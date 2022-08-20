import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useActiveDarkchatValue, useDarkchatMessagesValue } from '../../state/state';
import { useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import ChannelMessageBubble from '../ui/ChannelMessageBubble';
import ChannelImageBubble from '../ui/ChannelImageBubble';
import ChannelInput from '../ui/ChannelInput';
import { UploadMediaModal } from '../modals/UploadMedia';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { useHistory } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useModal } from '../../hooks/useModal';
import Backdrop from '@ui/components/Backdrop';
import { OwnerModal } from '@apps/darkchat/components/modals/OwnerModal';

export const ConversationView: React.FC = () => {
  const activeConversation = useActiveDarkchatValue();
  const { fetchMessages, fetchMembers } = useDarkchatAPI();
  const messages = useDarkchatMessagesValue();
  const history = useHistory();
  const query = useQueryParams();
  const { pathname, search } = useLocation();
  const { setModalMedia, modalVisible, ownerModal, setOwnerModal } = useModal();

  useEffect(() => {
    if (!query?.image) return;

    setModalMedia(query.image);

    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query?.image, history, pathname, search, setModalMedia]);

  useEffect(() => {
    fetchMessages(activeConversation.id);
    fetchMembers(activeConversation.id);
  }, [activeConversation]);

  if (!activeConversation && !messages) return <LoadingSpinner />;

  return (
    <Box display="flex" flexDirection="column" flex={1} flexGrow={1}>
      <UploadMediaModal />
      <OwnerModal open={ownerModal} closeModal={() => setOwnerModal(false)} />
      {modalVisible || (ownerModal && <Backdrop />)}
      <Box display="flex" flexDirection="column" width="100%" height={605} overflow="auto">
        {messages.map((message) =>
          /* type is wether or not the message is a image or not */
          message.isImage ? (
            <ChannelImageBubble {...message} />
          ) : (
            <ChannelMessageBubble {...message} />
          ),
        )}
      </Box>
      <Box>
        <ChannelInput />
      </Box>
    </Box>
  );
};
