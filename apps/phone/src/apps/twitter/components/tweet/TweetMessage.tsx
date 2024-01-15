import React, { memo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhone } from '@os/phone/hooks/usePhone';
import { getNewLineCount } from '../../utils/message';
import { NPWDTextarea, TextField } from '@ui/components/Input';
import { styled } from '@mui/material';

const MessageInput = styled(TextField)({
  flex: '1 1 100%',
  padding: '10px 15px',
  marginTop: '15px',
  overflowY: 'auto',
  maxHeight: '300px',
});

export const TweetMessage = ({ modalVisible, message, handleChange, onEnter }) => {
  const textFieldInputRef = useRef<HTMLTextAreaElement>(null);
  const { ResourceConfig } = usePhone();
  const [t] = useTranslation();

  const { characterLimit, newLineLimit } = ResourceConfig.twitter;

  useEffect(() => {
    textFieldInputRef.current && textFieldInputRef.current.focus();
  }, [modalVisible]);

  if (!ResourceConfig) return null;

  let errorMessage = null;

  const overCharacterLimit = message.trim().length > characterLimit;
  const characterWarningPrompt = `${t('TWITTER.TWEET_MESSAGE_CHAR_LIMIT')} (${characterLimit})`;

  const overNewLineLimit = getNewLineCount(message) > newLineLimit;
  const newLineWarningPrompt = `${t('TWITTER.TWEET_MESSAGE_NEW_LINE_LIMIT')} (${newLineLimit})`;

  if (overCharacterLimit) {
    errorMessage = characterWarningPrompt;
  } else if (overNewLineLimit) {
    errorMessage = newLineWarningPrompt;
  }

  const handleOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (overNewLineLimit) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      onEnter();
    }
  };

  return (
    <NPWDTextarea
      value={message}
      onChange={(e) => handleChange(e.currentTarget.value)}
      ref={textFieldInputRef}
      placeholder={t('TWITTER.TWEET_MESSAGE_PLACEHOLDER')}
      className="min-h-20 w-full resize-none rounded-md border border-neutral-600 bg-neutral-700 p-2 text-base text-white outline-none focus:ring-2 focus:ring-sky-400"
    />
  );

  return (
    <MessageInput
      value={message}
      inputProps={{
        style: {
          fontSize: '18px',
          paddingTop: '8px',
        },
      }}
      onChange={(e) => handleChange(e.currentTarget.value)}
      onKeyPress={handleOnEnter}
      fullWidth
      multiline
      placeholder={t('TWITTER.TWEET_MESSAGE_PLACEHOLDER')}
      inputRef={textFieldInputRef}
      error={errorMessage !== null}
      helperText={errorMessage || null}
    />
  );
};

export default memo(TweetMessage);
