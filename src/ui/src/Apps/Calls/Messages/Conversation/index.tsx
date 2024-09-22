import { TopNavigation } from '../../../../components/Navigation/TopNavigation';
import { useNavigate, useParams } from 'react-router';
import { useCurrentDevice } from '../../../../api/hooks/useCurrentDevice';
import { useEffect, useRef } from 'react';
import { useConversationMessages } from '../../../../api/hooks/useConversation';
import { useContactPhoneNumber } from '@/api/hooks/useContactPhoneNumber';
import { NewMessageForm } from '@/components/Forms/NewMessageForm';
import { Message } from './Message';

export const Conversation = () => {
  const navigate = useNavigate();
  const messageListRef = useRef<HTMLUListElement>(null);
  const device = useCurrentDevice();
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const contact = useContactPhoneNumber(phoneNumber);
  const messages = useConversationMessages(phoneNumber);

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
          const previousMessage = messages[index - 1];
          return (
            <Message
              message={message}
              previousMessage={previousMessage}
              isReceiver={message.receiver_id === device?.sim_card_id}
            />
          );
        })}
      </ul>

      <section className="pt-4 pb-10 mt-auto shadow-lg">
        <NewMessageForm phoneNumber={phoneNumber} />
      </section>
    </div>
  );
};
