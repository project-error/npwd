import { useRecoilValue } from 'recoil';
import { contactsState } from './state';

import { Contact } from '../../../common/typings/contact';
import { useCallback } from 'react';

interface IUseContacts {
  contacts: Contact[];
  getDisplayByNumber: (number: string) => string;
  getContact: (id: number) => Contact;
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
  const getContact = useCallback(
    (id: number): Contact | null => {
      for (const contact of contacts) {
        if (contact.id === id) return contact;
      }
    },
    [contacts],
  );
  return { contacts, getDisplayByNumber, getContact };
};
