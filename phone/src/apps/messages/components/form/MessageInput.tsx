import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Box, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import { Message, MessageEvents } from '@typings/messages';
import { TextField } from '@ui/components/Input';
import { fetchNui } from '../../../../utils/fetchNui';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { useMessageActions } from '../../hooks/useMessageActions';

interface IProps {
  onAddImageClick(): void;
  messageConversationId: string | undefined;
  messageGroupName: string | undefined;
}

const MessageInput = ({ messageConversationId, onAddImageClick }: IProps) => {
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();
  const [message, setMessage] = useState('');
  const { updateMessages } = useMessageActions();

  const handleSubmit = async () => {
    if (message.trim()) {
      fetchNui<ServerPromiseResp<Message>>(MessageEvents.SEND_MESSAGE, {
        conversationId: messageConversationId,
        message,
      }).then((resp) => {
        if (resp.status !== 'ok') {
          setMessage('');

          return addAlert({
            message: t('APPS_MESSAGES_NEW_MESSAGE_FAILED'),
            type: 'error',
          });
        }

        updateMessages(resp.data);
        setMessage('');
      });
    }
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      await handleSubmit();
    }
  };

  if (!messageConversationId) return null;

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
          placeholder={t('APPS_MESSAGES_NEW_MESSAGE')}
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
