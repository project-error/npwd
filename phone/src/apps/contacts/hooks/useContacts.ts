import { useRecoilValue } from 'recoil';
import { contactsState } from './state';

import { Contact } from '../../../../../typings/contact';
import { useCallback } from 'react';

interface IUseContacts {
  contacts: Contact[];
  getDisplayByNumber: (number: string) => string;
  getContactByNumber: (number: string) => Contact | null;
  getContact: (id: number) => Contact | null;
}

export const useContacts = (): IUseContacts => {
  const contacts = useRecoilValue(contactsState.contacts);

  const getDisplayByNumber = useCallback(
    (number: string) => {
      const found = contacts.find((contact) => contact.number === number);
      return found ? found.display : number;
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

  return { contacts, getDisplayByNumber, getContact, getContactByNumber };
};
