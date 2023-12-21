import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Box, Button, ButtonGroup } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import IosShareIcon from '@mui/icons-material/IosShare';
import { NPWDInput, NPWDTextarea, TextField } from '@ui/components/Input';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { useWordFilter } from '@os/wordfilter/hooks/useWordFilter';
import { useConfig } from '@os/phone/hooks';
import { Image, Mic, SendHorizonal, SendHorizontal } from 'lucide-react';

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

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      await handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };

  if (!messageConversation.id) return null;

  return (
    <div className="px-2">
      <div className="flex items-center space-x-2 rounded-md px-2 dark:bg-neutral-800">
        <button
          onClick={onAddImageClick}
          className="h-14 dark:text-white hover:dark:text-green-500"
        >
          <Image size={24} />
        </button>
        <NPWDTextarea
          rows={1}
          className="resize-none"
          onKeyDown={handleKeyPress}
          value={message}
          onChange={handleChange}
          placeholder={t('MESSAGES.NEW_MESSAGE')}
        />
        <div className="flex items-center space-x-2">
          {voiceEnabled && (
            <button onClick={onVoiceClick} className="hover:text-green-500">
              <Mic size={24} />
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
          >
            <SendHorizontal size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
