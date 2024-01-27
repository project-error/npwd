import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ActiveCall } from '@typings/call';
import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { CallNotification } from '../components/CallNotification';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';
import { useContacts } from '@apps/contacts/hooks/state';

const NOTIFICATION_ID = 'call:current';

export const useCallNotifications = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const { addNotificationAlert, removeId } = useNotifications();
  const { getDisplayByNumber } = useContactActions();
  const contacts = useContacts();

  const { icon, notificationIcon } = useApp('DIALER');

  const contactDisplay = useCallback(
    (number: string): string | null => {
      return contacts.length ? getDisplayByNumber(number) : null;
    },
    [contacts, getDisplayByNumber],
  );

  const callNotificationBase = {
    app: 'CALL',
    id: NOTIFICATION_ID,
    cantClose: false,
    icon,
    onClick: () => history.push('/call'),
    notificationIcon,
  };

  const clearNotification = (): void => {
    removeId(NOTIFICATION_ID);
  };

  const setNotification = (call: ActiveCall) => {
    if (!call) {
      removeId(NOTIFICATION_ID);
      return;
    }

    if (!call.isTransmitter && !call.is_accepted) {
      removeId(NOTIFICATION_ID);
      addNotificationAlert({
        ...callNotificationBase,
        title: t('DIALER.MESSAGES.INCOMING_CALL_TITLE', {
          transmitter: contactDisplay(call.transmitter) || call.transmitter,
        }),
        keepWhenPhoneClosed: true,
        content: (
          <CallNotification>
            {t('DIALER.MESSAGES.TRANSMITTER_IS_CALLING', {
              transmitter: call.isAnonymous
                ? 'Anonymous'
                : contactDisplay(call.transmitter) || call.transmitter,
            })}
          </CallNotification>
        ),
      });
    }
  };

  return { setNotification, clearNotification };
};
