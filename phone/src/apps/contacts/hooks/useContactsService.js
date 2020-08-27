import { useNuiEvent } from "../../../os/nui-events/hooks/useNuiEvent";
import { useSetRecoilState } from "recoil";
import { contactsState } from "./state";
import { useContacts } from "./useContacts";

export const useContactsService = () => {
  const setContacts = useSetRecoilState(contactsState.contacts);
  useNuiEvent("BANK", "setContacts", setContacts);
  return useContacts();
};
