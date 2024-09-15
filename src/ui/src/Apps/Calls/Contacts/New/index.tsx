import { NewContactForm } from '@/components/Contacts/NewContactForm';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
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
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>

        <NewContactForm onContactCreated={handleBack} />
      </DrawerContent>
    </Drawer>
  );
};
