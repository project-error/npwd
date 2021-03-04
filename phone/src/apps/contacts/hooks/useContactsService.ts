import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { contactsState } from './state';
import { useContacts } from './useContacts';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

export const useContactsService = () => {
  const setContacts = useSetRecoilState(contactsState.contacts);
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent('CONTACTS', 'setContacts', setContacts);
  useNuiEvent('CONTACTS', 'setAlert', handleAddAlert);
  return useContacts();
};
