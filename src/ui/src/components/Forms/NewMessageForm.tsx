import { queryClient } from '@/Providers';
import { instance } from '@/utils/fetch';
import { useRef, useState } from 'react';
import { Camera, Image, Send } from 'react-feather';
import { MessageWithPhoneNumbers } from '../../../../shared/Types';
import { Drawer } from '../Drawer';
import { Input, TextArea } from '../Input';
import { Button } from '../ui/button';
import { SelectImagesForm } from './SelectImagesForm';

export interface NewMessageFormProps {
  phoneNumber?: string;
  onMessageSent?: (message: MessageWithPhoneNumbers) => void;
}

export const NewMessageForm = ({
  phoneNumber: initialPhoneNumber,
  onMessageSent,
}: NewMessageFormProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isImagesOpen, setIsImagesOpen] = useState(false);
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
    const payload = {
      embedType: selectedImages.length ? 'image' : null,
      embedContent: selectedImages.join(','),
      phoneNumber,
      content: message,
    };

    const { data } = await instance.post<{ payload: MessageWithPhoneNumbers }>(
      '/messages/send',
      payload,
    );

    onMessageSent?.(data.payload);
    setSelectedImages([]);

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
    <>
      <form onSubmit={onSubmit} ref={formRef} className="flex flex-col">
        <div className="p-4 flex gap-2 mt-auto bg-secondary mx-4 rounded-lg items-center">
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex -m-2 pb-2 mb-2 border-b">
              <Button variant="ghost" size="icon" type="button">
                <Camera />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsImagesOpen(true)}
                type="button"
              >
                <Image />
              </Button>
            </div>

            {!initialPhoneNumber && (
              <Input
                autoFocus
                placeholder="Enter phone number .."
                className="outline-none py-0 px-0 border-b pb-2"
              />
            )}

            <div className="flex items-center gap-2">
              <TextArea
                ref={textAreaRef}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    formRef.current?.requestSubmit();
                  }
                }}
                placeholder="Message"
                className="bg-secondary text-primary flex-1 border-none outline-none py-0 px-0 border-b pb-2"
              />

              <button
                type="submit"
                className="p-3 flex-0 outline-none focus-visible:bg-primary rounded-lg"
              >
                <Send />
              </button>
            </div>

            <div className="flex gap-1 overflow-auto">
              {selectedImages.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="random"
                  className="w-14 h-14 object-cover object-center rounded-lg cursor-pointer flex-none hover:opacity-30"
                  onClick={() => {
                    setSelectedImages((images) => images.filter((img) => img !== image));
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </form>

      <Drawer open={isImagesOpen} onClose={() => setIsImagesOpen(false)} noPadding>
        <SelectImagesForm
          images={[]}
          selectedImages={selectedImages}
          onSelectedImagesChanged={setSelectedImages}
        />
      </Drawer>
    </>
  );
};
