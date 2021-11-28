import { useCallback } from 'react';
import { useSnackbar } from '../../../os/snackbar/hooks/useSnackbar';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import { Contact, ContactEvents, PreDBContact } from '../../../../../typings/contact';
import { useTranslation } from 'react-i18next';
import { useContactActions } from './useContactActions';
import { useHistory } from 'react-router';

export const useContactsAPI = () => {
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const { addLocalContact, updateLocalContact, deleteLocalContact } = useContactActions();
  const history = useHistory();

  const addNewContact = useCallback(
    ({ display, number, avatar }: PreDBContact, referral: string) => {
      fetchNui<ServerPromiseResp<Contact>>(ContactEvents.ADD_CONTACT, {
        display,
        number,
        avatar,
      }).then((serverResp) => {
        if (serverResp.status !== 'ok') {
          return addAlert({
            message: t('CONTACTS.ADD_FAILED'),
            type: 'error',
          });
        }

        // Sanity checks maybe?
        addLocalContact(serverResp.data);
        addAlert({
          message: t('CONTACTS.ADD_SUCCESS'),
          type: 'success',
        });
        history.replace(referral);
      });
    },
    [addAlert, addLocalContact, history, t],
  );

  const updateContact = useCallback(
    ({ id, display, number, avatar }: Contact) => {
      fetchNui<ServerPromiseResp>(ContactEvents.UPDATE_CONTACT, {
        id,
        display,
        number,
        avatar,
      }).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('CONTACTS.UPDATE_FAILED'),
            type: 'error',
          });
        }

        updateLocalContact({
          id,
          display,
          number,
          avatar,
        });

        addAlert({
          message: t('CONTACTS.UPDATE_SUCCESS'),
          type: 'success',
        });

        history.goBack();
      });
    },
    [addAlert, history, t, updateLocalContact],
  );

  const deleteContact = useCallback(
    ({ id }) => {
      fetchNui<ServerPromiseResp>(ContactEvents.DELETE_CONTACT, { id }).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('CONTACTS.DELETE_FAILED'),
            type: 'error',
          });
        }
        history.goBack();

        deleteLocalContact(id);

        addAlert({
          message: t('CONTACTS.DELETE_SUCCESS'),
          type: 'success',
        });
      });
    },
    [addAlert, deleteLocalContact, history, t],
  );

  return { addNewContact, updateContact, deleteContact };
};
