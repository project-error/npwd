import { NewMessageForm } from '@/components/Forms/NewMessageForm';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useNavigate } from 'react-router-dom';

export const NewMessageView = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Drawer modal open onClose={handleBack}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-primary">Compose a new message</DrawerTitle>
        </DrawerHeader>

        <NewMessageForm onMessageSent={handleBack} />
      </DrawerContent>
    </Drawer>
  );
};
