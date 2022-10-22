import { useContactsValue } from '@apps/contacts/hooks/state';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';
import { useCurrentCall } from '@os/call/hooks/state';
import { ActiveCall } from '@typings/call';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useCallNotification = () => {
  const [currentCall, setCurrenCall] = useCurrentCall();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const contacts = useContactsValue();
  const { getDisplayByNumber } = useContactActions();

  const contactDisplay = useCallback(
    (number: string): string => {
      return contacts.length ? getDisplayByNumber(number) : number;
    },
    [contacts, getDisplayByNumber],
  );

  const enqueueCallNotification = (dto: ActiveCall) => {
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
        onExited: () => {
          setCurrenCall(null);
        },
        transmitter: contactDisplay(dto.transmitter),
        receiver: contactDisplay(dto.receiver),
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
