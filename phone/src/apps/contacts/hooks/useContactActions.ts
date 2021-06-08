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
      const newContacts = [...contacts].filter((contact) => contact.id !== id);
      setContacts(newContacts);
    },
    [contacts, setContacts],
  );

  const addContact = useCallback(
    (contact: Contact) => {
      const newContactState = [...contacts, contact];
      setContacts(newContactState);
    },
    [contacts, setContacts],
  );

  const updateContact = useCallback(
    (updatedContact: Contact) => {
      const targetContactIndex = contacts.findIndex((contact) => contact.id === updatedContact.id);
      const newContactsArray = [...contacts];
      newContactsArray[targetContactIndex] = updatedContact;
      setContacts(newContactsArray);
    },
    [contacts, setContacts],
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
