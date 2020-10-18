import { useRecoilValue } from "recoil";
import { contactsState } from "./state";

interface Contact {
  id: string;
  display: string;
  number: string;
  avatar?: string
}

interface IUseContacts {
  contacts: Contact[];
}

export const useContacts = (): IUseContacts => {
  const contacts = useRecoilValue(contactsState.contacts);
  return { contacts };
};
