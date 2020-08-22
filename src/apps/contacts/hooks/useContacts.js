import { createContext } from "react";
import { useConfig } from "../../../config/hooks/useConfig";

export const ContactsContext = createContext({
  all: [
    {
      display: "Test Contact",
      phoneNumber: "000-1111",
    },
    {
      display: "Test Contact 2",
      phoneNumber: "000-1112",
    },
  ],
});

export const useContacts = () => {
  const [contacts, setContacts] = useConfig(ContactsContext);
  return [contacts.all, contacts => setContacts('all', contacts)]
};
