import { Fragment } from 'react';
import { Message as MessageType } from '../../../../../../shared/Types';
import { DateTime } from 'luxon';
import { StringifyDates } from '../../../../../../shared/TypeUtils';
import { clsx } from 'clsx';
import { ConversationImages } from './ConversationImages';

interface MessageProps {
  isReceiver: boolean;
  message: StringifyDates<MessageType>;
  previousMessage: StringifyDates<MessageType>;
}
export const Message = ({ isReceiver, message, previousMessage }: MessageProps) => {
  const timeDiffSincePrevMessage = previousMessage
    ? new Date(message.created_at).getTime() - new Date(previousMessage?.created_at).getTime()
    : 0;

  const shouldDisplayDate = !previousMessage || timeDiffSincePrevMessage > 60 * 5 * 1000;
  const isPreviousMessageDifferentSender = previousMessage?.sender_id !== message.sender_id;
  const luxonDate = DateTime.fromISO(message.created_at);

  const images = (message.embed_type === 'image' && message.embed_content?.split(',')) || [];

  return (
    <Fragment>
      {shouldDisplayDate && (
        <div className="flex gap-1 m-auto text-xs my-4">
          <span className="font-medium">Today</span>
          <span className="">{luxonDate?.toFormat('HH:mm')}</span>
        </div>
      )}

      {images.length > 0 && (
        <div
          className={clsx('flex gap-1', {
            'self-end': !isReceiver,
            'self-start': isReceiver,
          })}
        >
          <ConversationImages images={images} isReceiver={isReceiver} />
        </div>
      )}

      <li
        className={clsx(
          'p-4 rounded-lg max-w-[80%] shadow-sm text-ellipsis flex-1 break-words',
          {
            'self-end': !isReceiver,
            'self-start': isReceiver,
          },
          !isReceiver ? 'dark:bg-cyan-800 bg-cyan-100' : 'bg-secondary',
          !shouldDisplayDate && isPreviousMessageDifferentSender && 'mt-2',
        )}
      >
        {message.content}
      </li>
    </Fragment>
  );
};
