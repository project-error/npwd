import { useRecoilValue } from "recoil";
import { contactsState } from "./state";

export const useContacts = () => {
  const contacts = useRecoilValue(contactsState.contacts);
  return { contacts };
};
