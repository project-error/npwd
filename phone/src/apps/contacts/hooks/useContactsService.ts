import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSetRecoilState } from 'recoil';
import { contactsState } from './state';
import { useContacts } from './useContacts';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { ContactEvents } from '../../../../../typings/contact';

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

  useNuiEvent('CONTACTS', ContactEvents.SEND_CONTACTS, setContacts);
  useNuiEvent('CONTACTS', ContactEvents.SEND_ALERT, handleAddAlert);
  return useContacts();
};
