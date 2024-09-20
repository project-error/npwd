import { TopNavigation } from '../../../../components/Navigation/TopNavigation';
import { useNavigate, useParams } from 'react-router';
import { instance } from '../../../../utils/fetch';
import { useCurrentDevice } from '../../../../api/hooks/useCurrentDevice';
import { clsx } from 'clsx';
import { queryClient } from '../../../../Providers';
import { Fragment, useEffect, useRef } from 'react';
import { useConversationMessages } from '../../../../api/hooks/useConversation';
import { Send } from 'react-feather';
import { DateTime } from 'luxon';
import { useContactPhoneNumber } from '@/api/hooks/useContactPhoneNumber';

export const Conversation = () => {
  const navigate = useNavigate();
  const messageListRef = useRef<HTMLUListElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const device = useCurrentDevice();
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const contact = useContactPhoneNumber(phoneNumber);

  const messages = useConversationMessages(phoneNumber);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const message = form.querySelector('textarea')?.value;

    if (!phoneNumber || !message) {
      return;
    }

    // Send message to phoneNumber
    await instance.post('/messages/send', {
      content: message,
      phoneNumber,
    });

    textAreaRef.current?.focus();

    form.reset();
    queryClient.invalidateQueries({
      queryKey: ['messages'],
    });
    queryClient.invalidateQueries({
      queryKey: ['conversations'],
    });
    queryClient.invalidateQueries({
      queryKey: ['conversation', phoneNumber],
    });
  };

  /**
   * Scroll to bottom of the messages list when new message is added
   */
  useEffect(() => {
    const messagesList = messageListRef.current;
    /** Check if scroll is close to bottom, otherwise don't scroll */
    if (!messagesList) {
      return;
    }

    if (messagesList.scrollHeight - messagesList.scrollTop - messagesList.clientHeight > 100) {
      return;
    }

    messagesList.scrollTo(0, messagesList.scrollHeight);
  }, [messages.length]);

  /** Scroll to bottom initially. */
  useEffect(() => {
    const messagesList = messageListRef.current;
    if (!messagesList || messages.length === 0) {
      return;
    }

    messagesList.scrollTo(0, messagesList.scrollHeight);
  }, [messages.length]);

  return (
    <div className="flex flex-col h-full">
      <TopNavigation
        title={contact?.name || phoneNumber}
        left={
          <button onClick={() => navigate(-1)} className="text-primary">
            Back
          </button>
        }
      />

      <ul className="flex flex-col gap-1 p-4 overflow-auto" ref={messageListRef}>
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const timeDiffSincePrevMessage =
            index > 0
              ? new Date(message.created_at).getTime() - new Date(prevMessage?.created_at).getTime()
              : 0;

          const shouldDisplayDate = !prevMessage || timeDiffSincePrevMessage > 60 * 5 * 1000;
          const isPreviousMessageDifferentSender = prevMessage?.sender_id !== message.sender_id;
          const luxonDate = DateTime.fromISO(message.created_at);

          return (
            <Fragment key={message.id}>
              {shouldDisplayDate && (
                <div className="flex gap-1 m-auto text-xs my-4">
                  <span className="font-medium">Today</span>
                  <span className="">{luxonDate?.toFormat('HH:mm')}</span>
                </div>
              )}

              <li
                className={clsx(
                  'p-4 rounded-lg max-w-[80%] shadow-sm text-ellipsis flex-1 break-words',
                  {
                    'self-end': message.sender_id === device?.sim_card_id,
                    'self-start': message.receiver_id === device?.sim_card_id,
                  },
                  message.sender_id === device?.sim_card_id
                    ? 'dark:bg-cyan-800 bg-cyan-100'
                    : 'bg-secondary',
                  !shouldDisplayDate && isPreviousMessageDifferentSender && 'mt-2',
                )}
              >
                {message.content}
              </li>
            </Fragment>
          );
        })}
      </ul>

      <section className="pt-4 pb-10 mt-auto shadow-lg">
        <form
          onSubmit={onSubmit}
          className="p-4 flex gap-2 mt-auto bg-secondary mx-4 rounded-lg items-center"
          ref={formRef}
        >
          <textarea
            ref={textAreaRef}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                formRef.current?.requestSubmit();
              }
            }}
            placeholder="Message"
            className="bg-secondary text-primary flex-1 border-none outline-none"
          />

          <button
            type="submit"
            className="p-3 flex-0 outline-none focus-visible:bg-primary rounded-lg"
          >
            <Send />
          </button>
        </form>
      </section>
    </div>
  );
};
