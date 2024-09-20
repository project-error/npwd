import { useRef } from 'react';
import { Send } from 'react-feather';
import { instance } from '@/utils/fetch';
import { queryClient } from '@/Providers';
import { Input } from '../Input';

export interface NewMessageFormProps {
  phoneNumber?: string;
  onMessageSent: () => void;
}

export const NewMessageForm = ({
  phoneNumber: initialPhoneNumber,
  onMessageSent,
}: NewMessageFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const message = form.querySelector('textarea')?.value;
    const phoneNumber = initialPhoneNumber || form.querySelector('input')?.value;

    if (!phoneNumber || !message) {
      return;
    }

    // Send message to phoneNumber
    await instance.post('/messages/send', {
      content: message,
      phoneNumber,
    });

    onMessageSent();

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

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 flex flex-col gap-2 mt-auto bg-secondary mx-4 rounded-lg items-center "
      ref={formRef}
    >
      {!initialPhoneNumber && <Input placeholder="Enter phone number .." />}

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

      <button type="submit" className="p-3 flex-0 outline-none focus-visible:bg-primary rounded-lg">
        <Send />
      </button>
    </form>
  );
};
