import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Box, makeStyles, TextField, Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import ImageIcon from '@material-ui/icons/Image';
import Nui from '../../../../os/nui-events/utils/Nui';

interface IProps {
  onAddImageClick(): void;
  messageGroupId: string | undefined;
}

const useStyles = makeStyles({
  root: { position: 'absolute', bottom: 0, width: '100%' },
});

const MessageInput = ({ messageGroupId, onAddImageClick }: IProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      // don't allow the user to submit white space
      Nui.send('phone:sendMessage', {
        groupId: messageGroupId,
        message,
      });
      setMessage('');
    }
  };

  if (!messageGroupId) return null;

  return (
    <Paper variant="outlined" className={classes.root}>
      <form onSubmit={handleSubmit}>
        <Box display="flex">
          <Box pl={1} flexGrow={1}>
            <TextField
              fullWidth
              inputProps={{ style: { fontSize: '1.3em' } }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('APPS_MESSAGES_NEW_MESSAGE')}
              inputRef={(input) => input && input.focus()}
            />
          </Box>
          <Box>
            <Button onClick={onAddImageClick}>
              <ImageIcon />
            </Button>
            <Button type="submit">
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default MessageInput;
