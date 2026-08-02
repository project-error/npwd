import React from 'react';
import { ChannelMessageProps } from '@typings/darkchat';
import dayjs from 'dayjs';
import { PictureReveal } from '@ui/components/PictureReveal';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { cn } from '@utils/css';
import { DARKCHAT_APP_SECONDARY_COLOR } from '../../darkchat.theme';

const ChannelImageBubble: React.FC<ChannelMessageProps> = (item) => {
  return (
    <div
      className={cn(
        'mt-1 flex items-stretch',
        item.isMine ? 'mr-1 justify-end' : 'ml-1 justify-start',
      )}
    >
      <div
        className="h-auto w-auto min-w-[50%] max-w-[80%] rounded-lg px-4 py-1.5 text-white"
        style={{
          backgroundColor: item.isMine ? '#5ec46a' : DARKCHAT_APP_SECONDARY_COLOR,
        }}
      >
        <PictureReveal>
          <PictureResponsive src={item.message} alt="Darkchat image" />
        </PictureReveal>
        <p className="mt-1 font-medium text-[#ccc]">{dayjs.unix(item.createdAt).fromNow()}</p>
      </div>
    </div>
  );
};

export default ChannelImageBubble;
