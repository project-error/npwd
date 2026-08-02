import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { useWordFilter } from '@os/wordfilter/hooks/useWordFilter';
import { Image, Mic, SendHorizontal } from 'lucide-react';
import { Button } from '@npwd/keyos';

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
    <div className="border-t border-white/10 bg-keyos-night/90 px-3 py-3 backdrop-blur-xl">
      <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-keyos-panel p-2 shadow-keyos-panel">
        <button
          onClick={onAddImageClick}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-keyos-muted transition hover:bg-white/10 hover:text-keyos-cream"
          type="button"
        >
          <Image size={24} />
        </button>
        <textarea
          rows={1}
          className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-keyos-cream outline-none placeholder:text-keyos-muted"
          onKeyDown={handleKeyPress}
          value={message}
          onChange={handleChange}
          placeholder={t('MESSAGES.NEW_MESSAGE')}
        />
        <div className="flex shrink-0 items-center gap-1">
          {voiceEnabled && (
            <button
              onClick={onVoiceClick}
              className="flex size-10 items-center justify-center rounded-xl text-keyos-muted transition hover:bg-white/10 hover:text-[color:var(--keyos-app-accent)]"
              type="button"
            >
              <Mic size={24} />
            </button>
          )}

          <Button
            onClick={handleSubmit}
            className="bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] hover:brightness-110"
            size="icon"
            type="button"
          >
            <SendHorizontal size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
