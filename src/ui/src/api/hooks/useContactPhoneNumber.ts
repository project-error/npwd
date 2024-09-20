import { useContacts } from './useContacts';

export const useContactPhoneNumber = (phoneNumber?: string) => {
  const [contacts] = useContacts();
  const contact = contacts.find((contacts) => contacts.phone_number === phoneNumber);
  return contact;
};
