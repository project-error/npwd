import React, { memo } from 'react';
import { Image, Smile } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';
import { usePhone } from '@os/phone/hooks/usePhone';

export const IconButtons = ({ onImageClick, onEmojiClick }) => {
  const { ResourceConfig } = usePhone();

  if (!ResourceConfig) return null;
  const { enableImages, enableEmojis } = ResourceConfig.twitter;

  return (
    <div className="flex flex-row flex-nowrap justify-start pl-[5px]">
      {enableImages && (
        <NPWDButton size="sm" variant="ghost" onClick={onImageClick}>
          <Image size={20} className="text-keyos-muted" />
        </NPWDButton>
      )}
      {enableEmojis && (
        <NPWDButton size="sm" variant="ghost" onClick={onEmojiClick}>
          <Smile size={20} className="text-keyos-muted" />
        </NPWDButton>
      )}
    </div>
  );
};

export default memo(IconButtons);
