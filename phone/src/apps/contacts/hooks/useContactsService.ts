import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { contactsState } from './state';
import { useContacts } from './useContacts';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';

export const useContactsService = () => {
  const setContacts = useSetRecoilState(contactsState.contacts);
  const { addAlert } = useSnackbar();

  useNuiEvent('CONTACTS', 'setContacts', setContacts);
  useNuiEvent('CONTACTS', 'setAlert', addAlert);
  return useContacts();
};
