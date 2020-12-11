import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { contactsState } from './state';
import { useContacts } from './useContacts';
import { useContactAlert } from './useAlert';

export const useContactsService = () => {
  const setContacts = useSetRecoilState(contactsState.contacts);
  const setAlert = useSetRecoilState(contactsState.contactAlert);
  useNuiEvent('CONTACTS', 'setContacts', setContacts);
  useNuiEvent('CONTACTS', 'setAlert', setAlert);
  return { useContacts, useContactAlert };
};
