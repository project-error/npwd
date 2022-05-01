import React, { useState } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { TextField } from '@ui/components/Input';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useActiveDarkchatValue } from '../../state/state';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';

const ChannelInput: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [t] = useTranslation();
  const { sendMessage } = useDarkchatAPI();
  const { id: channelId } = useActiveDarkchatValue();

  const phoneNumber = useMyPhoneNumber();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage({
      channelId,
      message,
      phoneNumber,
    });
    setMessage('');
  };

  return (
    <Paper variant="outlined">
      <Box display="flex" flexDirection="row" pl={1}>
        <TextField
          style={{ paddingTop: 7, paddingBottom: 7 }}
          inputProps={{
            style: {
              fontSize: 18,
              textIndent: 5,
            },
          }}
          placeholder={t('DARKCHAT.MESSAGE_PLACEHOLDER')}
          variant="standard"
          fullWidth
          value={message}
          maxRows={4}
          multiline
          onChange={(e) => setMessage(e.currentTarget.value)}
        />
        <IconButton onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChannelInput;
