import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Box, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import { Message, MessageEvents } from '../../../../../../typings/messages';
import { TextField } from '../../../../ui/components/Input';
import { fetchNui } from '../../../../utils/fetchNui';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useMessageActions } from '../../hooks/useMessageActions';

interface IProps {
  onAddImageClick(): void;
  messageConversationId: string | undefined;
  messageGroupName: string | undefined;
}

const useStyles = makeStyles({
  root: { width: '100%' },
});

const MessageInput = ({ messageConversationId, onAddImageClick }: IProps) => {
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const { updateMessages } = useMessageActions();

  const handleSubmit = () => {
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  if (!messageConversationId) return null;

  return (
    <Paper variant="outlined" className={classes.root}>
      {/*<form onSubmit={handleSubmit}>*/}
      <Box display="flex">
        <Box pl={1} flexGrow={1}>
          <TextField
            multiline
            aria-multiline="true"
            fullWidth
            onKeyPress={handleKeyPress}
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
      </Box>
      {/*</form>*/}
    </Paper>
  );
};

export default MessageInput;
