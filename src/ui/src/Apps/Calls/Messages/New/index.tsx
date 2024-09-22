import { Drawer } from '@/components/Drawer';
import { NewMessageForm } from '@/components/Forms/NewMessageForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageWithPhoneNumbers } from '../../../../../../shared/Types';

export const NewMessageView = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleMessageSent = (message: MessageWithPhoneNumbers) => {
    console.log('Message sent', message);
    setIsOpen(false);
    setTimeout(() => {
      navigate(`/apps/conversation/${message.receiver_phone_number}`, { replace: true });
    }, 250);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      handleBack();
    }, 250);
  };

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <h1 className="pb-4 font-bold text-center text-xl">Compose a new message</h1>
      <NewMessageForm onMessageSent={handleMessageSent} />
    </Drawer>
  );
};
