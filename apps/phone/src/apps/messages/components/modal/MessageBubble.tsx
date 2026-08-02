import React, { useState } from 'react';
import { Message } from '@typings/messages';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import MessageBubbleMenu from './MessageBubbleMenu';
import { useSetSelectedMessage } from '../../hooks/state';
import MessageEmbed from '../ui/MessageEmbed';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import dayjs from 'dayjs';
import { MoreVertical } from 'lucide-react';
import { cn } from '@utils/css';
import { MessageBubble as KeyOSMessageBubble } from '@npwd/keyos';

const isImage = (url) => {
  return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif|webp)/g.test(url);
};

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getContactByNumber } = useContactActions();

  const setSelectedMessage = useSetSelectedMessage();
  const openMenu = () => {
    setMenuOpen(true);
    setSelectedMessage(message);
  };
  const myNumber = useMyPhoneNumber();
  const isMine = message.author === myNumber;

  let parsedEmbed;
  if (message?.embed) {
    parsedEmbed = JSON.parse(message?.embed);
  }

  const getContact = () => {
    return getContactByNumber(message.author);
  };

  const isMessageImage = isImage(message.message);
  const author = getContact()?.display ?? message.author;
  const timestamp = dayjs.unix(message.createdAt).fromNow();

  if (message.is_embed && parsedEmbed.type === 'audio') {
    return (
      <div>
        <div className={cn('mt-2 flex px-2', isMine ? 'justify-end' : 'justify-start')}>
          <KeyOSMessageBubble
            className="min-w-[60%] max-w-[80%]"
            from={isMine ? 'player' : 'contact'}
            meta={timestamp}
          >
            <MessageEmbed
              type={parsedEmbed.type}
              embed={parsedEmbed}
              isMine={isMine}
              message={message.message}
              openMenu={openMenu}
            />
            {!isMine && (
              <p className="mt-2 text-xs font-bold text-keyos-amber">{author}</p>
            )}
          </KeyOSMessageBubble>
        </div>
        <MessageBubbleMenu open={menuOpen} handleClose={() => setMenuOpen(false)} />
      </div>
    );
  }

  const showVertIcon = isMine || isMessageImage;

  return (
    <>
      <div className="mb-2 px-2 py-2">
        <div className={cn('flex items-center gap-2', isMine ? 'justify-end' : 'justify-start')}>
          <div className={cn('flex min-w-0 flex-col', isMine && 'items-end')}>
            <div>
              {!isMine && (
                <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-keyos-amber/80">
                  {author}
                </p>
              )}
            </div>
            <KeyOSMessageBubble from={isMine ? 'player' : 'contact'}>
              {message.is_embed ? (
                <>
                  <MessageEmbed
                    type={parsedEmbed.type}
                    embed={parsedEmbed}
                    isMine={isMine}
                    message={message.message}
                    openMenu={openMenu}
                  />
                </>
              ) : (
                <div>
                  {isMessageImage ? (
                    <img
                      src={message.message}
                      alt="message multimedia"
                      className="max-h-64 max-w-full rounded-xl object-cover"
                    />
                  ) : (
                    <p className="break-words text-sm">
                      {message.message}
                    </p>
                  )}
                </div>
              )}
            </KeyOSMessageBubble>
          </div>
          <div>
            {showVertIcon && (
              <button
                onClick={openMenu}
                className="rounded-full p-1 text-keyos-muted transition hover:bg-white/10 hover:text-keyos-cream"
              >
                <MoreVertical size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="px-2">
          <p className={cn('text-xs text-keyos-muted', isMine && 'text-right')}>{timestamp}</p>
        </div>
      </div>
      <MessageBubbleMenu
        message={message}
        isImage={isMessageImage}
        open={menuOpen}
        handleClose={() => setMenuOpen(false)}
      />
    </>
  );
};
