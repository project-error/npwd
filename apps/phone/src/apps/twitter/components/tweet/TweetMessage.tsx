import React, { memo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhone } from '@os/phone/hooks/usePhone';
import { getNewLineCount } from '../../utils/message';
import { NPWDTextarea } from '@ui/components/Input';

export const TweetMessage = ({ modalVisible, message, handleChange, onEnter }) => {
  const textFieldInputRef = useRef<HTMLTextAreaElement>(null);
  const { ResourceConfig } = usePhone();
  const [t] = useTranslation();

  useEffect(() => {
    textFieldInputRef.current && textFieldInputRef.current.focus();
  }, [modalVisible]);

  if (!ResourceConfig) return null;

  const { characterLimit, newLineLimit } = ResourceConfig.twitter;

  const overCharacterLimit = message.trim().length > characterLimit;
  const overNewLineLimit = getNewLineCount(message) > newLineLimit;

  let errorMessage = null;
  if (overCharacterLimit) {
    errorMessage = `${t('TWITTER.TWEET_MESSAGE_CHAR_LIMIT')} (${characterLimit})`;
  } else if (overNewLineLimit) {
    errorMessage = `${t('TWITTER.TWEET_MESSAGE_NEW_LINE_LIMIT')} (${newLineLimit})`;
  }

  const handleOnEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (overNewLineLimit) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onEnter();
    }
  };

  return (
    <div>
      <NPWDTextarea
        value={message}
        onChange={(e) => handleChange(e.currentTarget.value)}
        onKeyDown={handleOnEnter}
        ref={textFieldInputRef}
        placeholder={t('TWITTER.TWEET_MESSAGE_PLACEHOLDER')}
        className="mt-[15px] min-h-20 w-full max-h-[300px] resize-none overflow-y-auto rounded-md border border-neutral-600 bg-neutral-700 p-2 text-base text-white outline-none focus:ring-2 focus:ring-sky-400"
      />
      {errorMessage && <p className="mt-1 text-sm text-red-400">{errorMessage}</p>}
    </div>
  );
};

export default memo(TweetMessage);
