import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useContactsValue, useSetContacts } from './state';

import { Contact } from '@typings/contact';
import { MESSAGE_CONVERSATIONS_QUERY_KEY } from '../../messages/hooks/state';
import { MessageConversation } from '@typings/messages';

interface UseContactsValue {
  getDisplayByNumber: (number: string) => string;
  getContactByNumber: (number: string) => Contact | null;
  getContact: (id: number) => Contact | null;
  getPictureByNumber: (number: string) => string | null;
  deleteLocalContact: (id: number) => void;
  addLocalContact: (contact: Contact) => void;
  updateLocalContact: (contact: Contact) => void;
  findExistingConversation: (
    myPhoneNumber: string,
    targetPhoneNumber: string,
  ) => MessageConversation | null;
}

export const useContactActions = (): UseContactsValue => {
  const setContacts = useSetContacts();
  const contacts = useContactsValue();
  const queryClient = useQueryClient();

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
    (number: string) => contacts.find((contact) => contact.number === number) ?? null,
    [contacts],
  );

  const getContact = useCallback(
    (id: number) => contacts.find((contact) => contact.id === id) ?? null,
    [contacts],
  );

  const deleteLocalContact = useCallback(
    (id: number) => {
      setContacts((curContacts) => [...curContacts].filter((contact) => contact.id !== id));
    },
    [setContacts],
  );

  const addLocalContact = useCallback(
    (contact: Contact) => {
      setContacts((curContacts) => [...curContacts, contact]);
    },
    [setContacts],
  );

  const updateLocalContact = useCallback(
    (updatedContact: Contact) => {
      setContacts((curContacts) =>
        curContacts.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)),
      );
    },
    [setContacts],
  );

  const findExistingConversation = useCallback(
    (myPhoneNumber: string, targetPhoneNumber: string) => {
      const conversations =
        queryClient.getQueryData<MessageConversation[]>(MESSAGE_CONVERSATIONS_QUERY_KEY) ?? [];
      const conversationList = [myPhoneNumber, targetPhoneNumber].sort().join('+');

      return (
        conversations.find((conversation) => conversation.conversationList === conversationList) ??
        null
      );
    },
    [queryClient],
  );

  return {
    getDisplayByNumber,
    getContact,
    getContactByNumber,
    getPictureByNumber,
    deleteLocalContact,
    updateLocalContact,
    addLocalContact,
    findExistingConversation,
  };
};
