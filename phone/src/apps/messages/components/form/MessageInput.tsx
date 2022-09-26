import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Box, Button, ButtonGroup } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import IosShareIcon from '@mui/icons-material/IosShare';
import { TextField } from '@ui/components/Input';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { useWordFilter } from '@os/wordfilter/hooks/useWordFilter';
import { useConfig } from '@os/phone/hooks';

interface IProps {
  onAddImageClick(): void;
  onVoiceClick: () => void;
  messageConversation: MessageConversation | undefined;
  messageGroupName: string | undefined;
  voiceEnabled: boolean;
}

const MessageInput = ({
  messageConversation,
  onAddImageClick,
  onVoiceClick,
  voiceEnabled,
}: IProps) => {
  const [t] = useTranslation();
  const [message, setMessage] = useState('');
  const { sendMessage } = useMessageAPI();
  const { activeMessageConversation } = useMessages();
  const { clean } = useWordFilter();

  const handleSubmit = async () => {
    if (message.trim()) {
      await sendMessage({
        conversationId: messageConversation.id,
        conversationList: activeMessageConversation.conversationList,
        message: clean(message),
        tgtPhoneNumber: messageConversation.participant,
      });
      setMessage('');
    }
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      await handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };

  if (!messageConversation.id) return null;

  return (
    <Paper
      variant="outlined"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Box pt={1} pl={1} pb={1} flexGrow={1}>
        <TextField
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          aria-multiline="true"
          inputProps={{ style: { fontSize: '1.3em' } }}
          value={message}
          onChange={handleChange}
          placeholder={t('MESSAGES.NEW_MESSAGE')}
        />
      </Box>
      <Box pr={1}>
        <ButtonGroup size="small">
          {voiceEnabled && (
            <Button size="small" onClick={onVoiceClick}>
              <MicIcon />
            </Button>
          )}
          <Button size="small" onClick={onAddImageClick}>
            <IosShareIcon />
          </Button>
          <Button size="small" onClick={handleSubmit}>
            <SendIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </Paper>
  );
};

export default MessageInput;
