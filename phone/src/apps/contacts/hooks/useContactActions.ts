import { contactsState, useSetContacts } from './state';

import { Contact } from '@typings/contact';
import { useRecoilCallback } from 'recoil';

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
  const setContacts = useSetContacts();

  const getDisplayByNumber = useRecoilCallback<[string], string>(
    ({ snapshot }) =>
      (number: string) => {
        const { state, contents } = snapshot.getLoadable(contactsState.contacts);

        if (state !== 'hasValue') return number;

        const found = contents.find((contact) => contact.number === number);
        return found ? found.display : number;
      },
    [],
  );

  const getPictureByNumber = useRecoilCallback<[string], string>(
    ({ snapshot }) =>
      (number: string) => {
        const { state, contents } = snapshot.getLoadable(contactsState.contacts);
        if (state !== 'hasValue') return null;

        const found = contents.find((contact) => contact.number === number);
        return found ? found.avatar : null;
      },
    [],
  );

  const getContactByNumber = useRecoilCallback<[string], Contact>(
    ({ snapshot }) =>
      (number: string) => {
        const { state, contents } = snapshot.getLoadable(contactsState.contacts);
        if (state !== 'hasValue') return null;

        for (const contact of contents) {
          if (contact.number === number) return contact;
        }
        return null;
      },
    [],
  );

  const getContact = useRecoilCallback<[number], Contact | null>(
    ({ snapshot }) =>
      (id: number) => {
        const { state, contents } = snapshot.getLoadable(contactsState.contacts);
        if (state !== 'hasValue') return null;

        for (const contact of contents) {
          if (contact.id === id) return contact;
        }
        return null;
      },
    [],
  );

  const deleteLocalContact = useRecoilCallback<[number], void>(
    ({ snapshot }) =>
      (id: number) => {
        const { state } = snapshot.getLoadable(contactsState.contacts);
        if (state !== 'hasValue') return null;

        setContacts((curContacts) => [...curContacts].filter((contact) => contact.id !== id));
      },
    [],
  );

  const addLocalContact = useRecoilCallback<[Contact], void>(
    ({ snapshot }) =>
      (contact) => {
        const { state } = snapshot.getLoadable(contactsState.contacts);
        if (state !== 'hasValue') return null;
        setContacts((curContacts) => [...curContacts, contact]);
      },
    [],
  );

  const updateLocalContact = useRecoilCallback<[Contact], void>(
    ({ snapshot }) =>
      (updatedContact) => {
        const { state } = snapshot.getLoadable(contactsState.contacts);

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
    [],
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
