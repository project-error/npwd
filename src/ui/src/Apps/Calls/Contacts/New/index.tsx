import { NewContactForm } from '@/components/Contacts/NewContactForm';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useNavigate } from 'react-router-dom';

export const NewContactView = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Drawer modal open onClose={handleBack}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a new contact</DrawerTitle>
        </DrawerHeader>

        <NewContactForm onContactCreated={handleBack} />
      </DrawerContent>
    </Drawer>
  );
};
