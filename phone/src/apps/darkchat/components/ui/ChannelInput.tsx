import React, { useState } from 'react';
import { Box, Button, Paper, Tooltip } from '@mui/material';
import { TextField } from '@ui/components/Input';
import SendIcon from '@mui/icons-material/Send';
import IosShareIcon from '@mui/icons-material/IosShare';
import { useTranslation } from 'react-i18next';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useActiveDarkchatValue } from '../../state/state';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useModal } from '../../hooks/useModal';

const ChannelInput: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [t] = useTranslation();
  const { sendMessage } = useDarkchatAPI();
  const { id: channelId } = useActiveDarkchatValue();
  const phoneNumber = useMyPhoneNumber();
  const { setModalVisible } = useModal();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage({
      channelId,
      message,
      phoneNumber,
      type: 'text',
    });
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage();
      setMessage('');
    }
  };

  return (
    <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center' }}>
      <Box pl={3} pt={1} pb={1} flexGrow={1}>
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
          onKeyPress={handleKeyPress}
        />
      </Box>
      <Box>
        <Button color="secondary" onClick={() => setModalVisible(true)}>
          <Tooltip title={t('DARKCHAT.MEDIA_UPLOAD')}>
            <IosShareIcon />
          </Tooltip>
        </Button>
        <Button onClick={handleSendMessage} color="secondary">
          <Tooltip title={t('GENERIC.SEND')}>
            <SendIcon />
          </Tooltip>
        </Button>
      </Box>
    </Paper>
  );
};

export default ChannelInput;
