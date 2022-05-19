import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useActiveDarkchatValue, useDarkchatMessagesValue } from '../../state/state';
import { useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import ChannelMessageBubble from '../ui/ChannelMessageBubble';
import ChannelImageBubble from '../ui/ChannelImageBubble';
import ChannelInput from '../ui/ChannelInput';
import { UploadMediaModal } from '../modals/UploadMedia';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { useHistory } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useModal } from '../../hooks/useModal';

export const ConversationView: React.FC = () => {
  const activeConversation = useActiveDarkchatValue();
  const { fetchMessages } = useDarkchatAPI();
  const messages = useDarkchatMessagesValue();
  const history = useHistory();
  const query = useQueryParams();
  const { pathname, search } = useLocation();
  const { setModalMedia } = useModal();

  useEffect(() => {
    if (!query?.image) return;

    setModalMedia(query.image);

    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query?.image, history, pathname, search, setModalMedia]);

  useEffect(() => {
    fetchMessages(activeConversation.id);
  }, [activeConversation]);

  if (!activeConversation && !messages) return <LoadingSpinner />;

  return (
    <Box display="flex" flexDirection="column" flex={1} flexGrow={1}>
      <UploadMediaModal />
      <Box display="flex" flexDirection="column" width="100%" height={605} overflow="auto">
        {messages.map((message) =>
          message.type === 'text' ? (
            <ChannelMessageBubble {...message} />
          ) : (
            <ChannelImageBubble {...message} />
          ),
        )}
      </Box>
      <Box>
        <ChannelInput />
      </Box>
    </Box>
  );
};
