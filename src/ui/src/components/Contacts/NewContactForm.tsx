import { createContact } from '@/api/contacts';
import { queryClient } from '@/Providers';
import { Contact } from '../../../../shared/Types';
import { useState } from 'react';
import { handleClientError } from '@/utils/errors';
import { Button } from '../ui/button';
import { Input } from '../Input';

interface NewContactFormProps {
  onContactCreated: () => void;
}
export const NewContactForm = ({ onContactCreated }: NewContactFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const phoneNumber = formData.get('phone_number') as string;

    if (!name || !phoneNumber) {
      return;
    }

    try {
      const { payload } = await createContact(name, phoneNumber);
      onContactCreated();

      /**
       * Update the cache with the new contact.
       */
      queryClient.setQueryData(['contacts'], (contacts: { payload: Contact[] }) => {
        return {
          ...contacts,
          payload: [payload, ...contacts.payload],
        };
      });
    } catch (error) {
      console.log(error);
      setError(handleClientError(error));
    }
  };

  return (
    <form
      className="flex flex-col gap-2 p-4"
      onSubmit={handleSubmit}
      onFocus={() => setError(null)}
    >
      <Input name="name" placeholder="Name" />
      <Input name="phone_number" placeholder="Phone number" />

      {error && <div className="text-red-500">{error}</div>}

      <Button type="submit" variant="outline" className="text-primary">
        Create
      </Button>
    </form>
  );
};
