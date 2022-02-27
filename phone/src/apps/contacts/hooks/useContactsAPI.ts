import { useCallback } from 'react';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { Contact, ContactEvents, PreDBContact } from '@typings/contact';
import { useTranslation } from 'react-i18next';
import { useContactActions } from './useContactActions';
import { useHistory } from 'react-router';

export const useContactsAPI = () => {
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const { addLocalContact, updateLocalContact, deleteLocalContact } = useContactActions();
  const history = useHistory();

  const addNewContact = useCallback(
    ({ display, number, avatar }: PreDBContact, referral?: string) => {
      fetchNui<Contact>(ContactEvents.ADD_CONTACT, {
        display,
        number,
        avatar,
      })
        .then((resp) => {
          // Sanity checks maybe?
          resp && addLocalContact(resp);
          addAlert({
            message: t('CONTACTS.FEEDBACK.ADD_SUCCESS'),
            type: 'success',
          });

          referral && history.replace(referral);
        })
        .catch(() => {
          return addAlert({
            message: t('ADD_FAILED'),
            type: 'error',
          });
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
      })
        .then(() => {
          updateLocalContact({
            id,
            display,
            number,
            avatar,
          });

          addAlert({
            message: t('CONTACTS.FEEDBACK.UPDATE_SUCCESS'),
            type: 'success',
          });

          history.goBack();
        })
        .catch(() => {
          return addAlert({
            message: t('UPDATE_FAILED'),
            type: 'error',
          });
        });
    },
    [addAlert, history, t, updateLocalContact],
  );

  const deleteContact = useCallback(
    ({ id }) => {
      fetchNui<ServerPromiseResp>(ContactEvents.DELETE_CONTACT, { id })
        .then(() => {
          history.goBack();

          deleteLocalContact(id);

          addAlert({
            message: t('CONTACTS.FEEDBACK.DELETE_SUCCESS'),
            type: 'success',
          });
        })
        .catch(() => {
          return addAlert({
            message: t('CONTACTS.FEEDBACK.DELETE_FAILED'),
            type: 'error',
          });
        });
    },
    [addAlert, deleteLocalContact, history, t],
  );

  return { addNewContact, updateContact, deleteContact };
};
