import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useActiveDarkchatValue, useDarkchatMessagesValue } from '../../state/state';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import ChannelMessageBubble from '../ui/ChannelMessageBubble';
import ChannelInput from '../ui/ChannelInput';

export const ConversationView: React.FC = () => {
  const activeConversation = useActiveDarkchatValue();
  const { fetchMessages } = useDarkchatAPI();
  const messages = useDarkchatMessagesValue();

  useEffect(() => {
    fetchMessages(activeConversation.id);
  }, [activeConversation]);

  if (!activeConversation && !messages) return <LoadingSpinner />;

  return (
    <Box display="flex" flexDirection="column" flex={1} flexGrow={1}>
      <Box display="flex" flexDirection="column" width="100%" height={605} overflow="auto">
        {messages.map((message) => (
          <ChannelMessageBubble {...message} />
        ))}
      </Box>
      <Box>
        <ChannelInput />
      </Box>
    </Box>
  );
};
