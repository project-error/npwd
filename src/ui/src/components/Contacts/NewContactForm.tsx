import { createContact } from '@/api/contacts';
import { queryClient } from '@/Providers';
import { Contact } from '../../../../shared/Types';
import { useState } from 'react';
import { handleClientError } from '@/utils/errors';
import { Button } from '../ui/button';

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
      className="flex flex-col gap-2 p-4 "
      onSubmit={handleSubmit}
      onFocus={() => setError(null)}
    >
      <input
        name="name"
        type="text"
        placeholder="Name"
        className="bg-secondary px-4 py-2 rounded-sm"
      />
      <input
        name="phone_number"
        type="text"
        placeholder="Phone number"
        className="bg-secondary px-4 py-2 rounded-sm"
      />

      {error && <div className="text-red-500">{error}</div>}

      <Button type="submit" variant="outline">
        Create
      </Button>
    </form>
  );
};
