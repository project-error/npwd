import { useContacts } from '@/api/hooks/useContacts';
import { EditContactForm } from '@/components/Contacts/EditContactForm';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditContactView = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const { contactId } = useParams<{ contactId: string }>();
  const [contacts, , isLoading] = useContacts();
  console.log({ contacts, isLoading });
  const contact = contacts.find((contact) => contact.id === parseInt(contactId ?? '', 10));

  useEffect(() => {
    if (!contact && !isLoading) {
      handleBack();
    }
  }, [contact, handleBack, isLoading]);

  return (
    <Drawer modal open onClose={handleBack}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-primary">Update contact</DrawerTitle>
        </DrawerHeader>

        <EditContactForm onContactUpdated={handleBack} contact={contact} />
      </DrawerContent>
    </Drawer>
  );
};
