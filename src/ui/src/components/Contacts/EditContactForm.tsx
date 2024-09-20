import { updateContact } from '@/api/contacts';
import { queryClient } from '@/Providers';
import { Contact } from '../../../../shared/Types';
import { useState } from 'react';
import { handleClientError } from '@/utils/errors';
import { Button } from '../ui/button';
import { Input } from '../Input';

interface NewContactFormProps {
  contact?: Contact;
  onContactUpdated: () => void;
}

export const EditContactForm = ({ onContactUpdated, contact }: NewContactFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const phoneNumber = formData.get('phone_number') as string;

    if (!name || !phoneNumber || !contact) {
      return;
    }

    try {
      const { payload } = await updateContact({
        ...contact,
        name,
        phone_number: phoneNumber,
      });

      onContactUpdated();

      /**
       * Update the cache with the new contact.
       */
      queryClient.setQueryData(['contacts'], (contacts: { payload: Contact[] }) => {
        return {
          ...contacts,
          payload: contacts.payload.map((contact) => {
            if (contact.phone_number === phoneNumber) {
              return payload;
            }

            return contact;
          }),
        };
      });
    } catch (error) {
      console.log(error);
      setError(handleClientError(error));
    }
  };

  if (!contact) {
    return null;
  }

  return (
    <form
      className="flex flex-col gap-2 p-4"
      onSubmit={handleSubmit}
      onFocus={() => setError(null)}
    >
      <Input name="name" placeholder="Name" defaultValue={contact.name} />
      <Input name="phone_number" placeholder="Phone number" defaultValue={contact.phone_number} />

      {error && <div className="text-red-500">{error}</div>}

      <Button type="submit" variant="outline" className="text-primary">
        Update contact
      </Button>
    </form>
  );
};
