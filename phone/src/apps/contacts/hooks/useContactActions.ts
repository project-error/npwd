import { contactsState } from './state';

import { Contact } from '../../../../../typings/contact';
import { useCallback } from 'react';
import { useRecoilStateLoadable } from 'recoil';

interface UseContactsValue {
  getDisplayByNumber: (number: string) => string;
  getContactByNumber: (number: string) => Contact | null;
  getContact: (id: number) => Contact | null;
  getPictureByNumber: (number: string) => string | null;
  deleteLocalContact: (id: number) => void;
  addLocalContact: (contact: Contact) => void;
  updateLocalContact: (contact: Contact) => void;
}

export const useContactActions = (): UseContactsValue => {
  const [{ state, contents }, setContacts] = useRecoilStateLoadable(contactsState.contacts);

  const getDisplayByNumber = useCallback(
    (number: string) => {
      if (state !== 'hasValue') return null;

      const found = contents.find((contact) => contact.number === number);
      return found ? found.display : number;
    },
    [contents, state],
  );

  const getPictureByNumber = useCallback(
    (number: string) => {
      if (state !== 'hasValue') return null;

      const found = contents.find((contact) => contact.number === number);
      return found ? found.avatar : null;
    },
    [contents, state],
  );

  const getContactByNumber = useCallback(
    (number: string): Contact | null => {
      if (state !== 'hasValue') return null;

      for (const contact of contents) {
        if (contact.number === number) return contact;
      }
      return null;
    },
    [contents, state],
  );

  const getContact = useCallback(
    (id: number): Contact | null => {
      if (state !== 'hasValue') return null;

      for (const contact of contents) {
        if (contact.id === id) return contact;
      }
      return null;
    },
    [contents, state],
  );

  const deleteLocalContact = useCallback(
    (id: number): void => {
      if (state !== 'hasValue') return null;

      setContacts((curContacts) => [...curContacts].filter((contact) => contact.id !== id));
    },
    [setContacts, state],
  );

  const addLocalContact = useCallback(
    (contact: Contact) => {
      if (state !== 'hasValue') return null;

      setContacts((curContacts) => [...curContacts, contact]);
    },
    [setContacts, state],
  );

  const updateLocalContact = useCallback(
    (updatedContact: Contact) => {
      if (state !== 'hasValue') return null;

      setContacts((curContacts) => {
        const targetContactIndex = curContacts.findIndex(
          (contact) => contact.id === updatedContact.id,
        );
        const newContactsArray = [...curContacts];
        newContactsArray[targetContactIndex] = updatedContact;
        return newContactsArray;
      });
    },
    [setContacts, state],
  );

  return {
    getDisplayByNumber,
    getContact,
    getContactByNumber,
    getPictureByNumber,
    deleteLocalContact,
    updateLocalContact,
    addLocalContact,
  };
};
