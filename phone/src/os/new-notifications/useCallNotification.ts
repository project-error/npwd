import { useContactsValue } from '@apps/contacts/hooks/state';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';
import { useCurrentCallValue } from '@os/call/hooks/state';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useCallNotification = () => {
  const currentCall = useCurrentCallValue();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const contacts = useContactsValue();
  const { getDisplayByNumber } = useContactActions();

  const contactDisplay = useCallback(
    (number: string): string => {
      return contacts.length ? getDisplayByNumber(number) : number;
    },
    [contacts, getDisplayByNumber],
  );

  const enqueueCallNotification = (dto: any) => {
    if (!currentCall) {
      closeSnackbar('npwd:callNotification');
      enqueueSnackbar('', {
        variant: 'npwdCallNotification',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        persist: true,
        title: 'Call',
        transmitter: contactDisplay(dto.transmitter),
        key: 'npwd:callNotification',
      });
    }
  };

  const removeNotification = () => {
    closeSnackbar('npwd:callNotification');
  };

  return {
    enqueueCallNotification,
    removeNotification,
  };
};
