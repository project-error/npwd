import { useContactActions } from './useContactActions';
import { useNuiEvent } from 'fivem-nui-react-lib/';
import { AddContactExportData, ContactEvents, ContactsDatabaseLimits } from '@typings/contact';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import qs from 'qs';
import { useApps } from '@os/apps/hooks/useApps';

export const useContactsListener = () => {
  const { getContactByNumber } = useContactActions();
  const history = useHistory();
  const { getApp } = useApps();

  const addContactExportHandler = useCallback(
    (contactData: AddContactExportData) => {
      const contact = getContactByNumber(contactData.number);
      const { path } = getApp('CONTACTS');

      const queryData = qs.stringify({
        addNumber: contactData.number.slice(0, ContactsDatabaseLimits.number),
        name: contactData.name?.slice(0, ContactsDatabaseLimits.display),
        avatar: contactData.avatar?.slice(0, ContactsDatabaseLimits.avatar),
      });

      if (!contact) {
        return history.push({
          pathname: `${path}/-1`,
          search: `?${queryData}`,
        });
      }

      history.push({
        pathname: `${path}/${contact.id}`,
        search: `?${queryData}`,
      });
    },
    [getApp, getContactByNumber, history],
  );

  useNuiEvent<AddContactExportData>(
    'CONTACTS',
    ContactEvents.ADD_CONTACT_EXPORT,
    addContactExportHandler,
  );
};
