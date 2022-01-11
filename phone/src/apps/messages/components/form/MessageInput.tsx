import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Box, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import { TextField } from '@ui/components/Input';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '../../../../../../typings/messages';

interface IProps {
  onAddImageClick(): void;
  messageConversation: MessageConversation | undefined;
  messageGroupName: string | undefined;
}

const MessageInput = ({ messageConversation, onAddImageClick }: IProps) => {
  const [t] = useTranslation();
  const [message, setMessage] = useState('');
  const { sendMessage } = useMessageAPI();

  const handleSubmit = async () => {
    if (message.trim()) {
      await sendMessage({
        conversationId: messageConversation.conversation_id,
        message,
        tgtPhoneNumber: messageConversation.phoneNumber,
      });
      setMessage('');
    }
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      await handleSubmit();
    }
  };

  if (!messageConversation.conversation_id) return null;

  return (
    <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center' }}>
      <Box pl={3} pt={1} pb={1} flexGrow={1}>
        <TextField
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          aria-multiline="true"
          fullWidth
          inputProps={{ style: { fontSize: '1.3em' } }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('MESSAGES.NEW_MESSAGE')}
        />
      </Box>
      <Box>
        <Button onClick={onAddImageClick}>
          <ImageIcon />
        </Button>
        <Button onClick={handleSubmit}>
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default MessageInput;
