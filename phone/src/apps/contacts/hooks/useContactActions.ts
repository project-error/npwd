import { useContacts } from './state';

import { Contact } from '../../../../../typings/contact';
import { useCallback } from 'react';

interface UseContactsValue {
  getDisplayByNumber: (number: string) => string;
  getContactByNumber: (number: string) => Contact | null;
  getContact: (id: number) => Contact | null;
  getPictureByNumber: (number: string) => string | null;
  deleteContact: (id: number) => void;
  addContact: (contact: Contact) => void;
  updateContact: (contact: Contact) => void;
}

export const useContactActions = (): UseContactsValue => {
  const [contacts, setContacts] = useContacts();

  const getDisplayByNumber = useCallback(
    (number: string) => {
      const found = contacts.find((contact) => contact.number === number);
      return found ? found.display : number;
    },
    [contacts],
  );

  const getPictureByNumber = useCallback(
    (number: string) => {
      const found = contacts.find((contact) => contact.number === number);
      return found ? found.avatar : null;
    },
    [contacts],
  );

  const getContactByNumber = useCallback(
    (number: string): Contact | null => {
      for (const contact of contacts) {
        if (contact.number === number) return contact;
      }
      return null;
    },
    [contacts],
  );

  const getContact = useCallback(
    (id: number): Contact | null => {
      for (const contact of contacts) {
        if (contact.id === id) return contact;
      }
      return null;
    },
    [contacts],
  );

  const deleteContact = useCallback(
    (id: number): void => {
      setContacts((curContacts) => [...curContacts].filter((contact) => contact.id !== id));
    },
    [setContacts],
  );

  const addContact = useCallback(
    (contact: Contact) => {
      setContacts((curContacts) => [...curContacts, contact]);
    },
    [setContacts],
  );

  const updateContact = useCallback(
    (updatedContact: Contact) => {
      setContacts((curContacts) => {
        const targetContactIndex = curContacts.findIndex(
          (contact) => contact.id === updatedContact.id,
        );
        const newContactsArray = [...curContacts];
        newContactsArray[targetContactIndex] = updatedContact;
        return newContactsArray;
      });
    },
    [setContacts],
  );

  return {
    getDisplayByNumber,
    getContact,
    getContactByNumber,
    getPictureByNumber,
    deleteContact,
    updateContact,
    addContact,
  };
};
