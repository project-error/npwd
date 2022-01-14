import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ActiveCall } from '@typings/call';
import { useApp } from '@os/apps/hooks/useApps';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { useRingtoneSound } from '@os/sound/hooks/useRingtoneSound';
import { CallNotification } from '../components/CallNotification';
import { useContactActions } from '../../../apps/contacts/hooks/useContactActions';
import { Contact } from '../../../../../typings/contact';
import { useContacts } from '../../../apps/contacts/hooks/state';

const NOTIFICATION_ID = 'call:current';

export const useCallNotifications = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const { addNotificationAlert, removeId, addNotification } = useNotifications();
  const { getDisplayByNumber } = useContactActions();
  const contacts = useContacts();

  const { play, stop } = useRingtoneSound();

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
    cantClose: true,
    icon,
    onClick: () => history.push('/call'),
    notificationIcon,
  };

  const clearNotification = (): void => {
    removeId(NOTIFICATION_ID);
    stop();
  };

  const setNotification = (call: ActiveCall) => {
    stop();
    if (!call) {
      removeId(NOTIFICATION_ID);
      return;
    }

    if (call?.is_accepted) {
      removeId(NOTIFICATION_ID);
      addNotification({
        ...callNotificationBase,
        content: (
          <CallNotification>
            {t('DIALER.MESSAGES.CURRENT_CALL_WITH', {
              transmitter: contactDisplay(call.transmitter) || call.transmitter,
            })}
          </CallNotification>
        ),
        title: t('DIALER.MESSAGES.CURRENT_CALL_TITLE'),
      });
    }
    if (!call?.isTransmitter && !call?.is_accepted) {
      play();
      removeId(NOTIFICATION_ID);
      addNotificationAlert(
        {
          ...callNotificationBase,
          title: t('DIALER.MESSAGES.INCOMING_CALL_TITLE', {
            transmitter: contactDisplay(call.transmitter) || call.transmitter,
          }),
          keepWhenPhoneClosed: false,
          content: (
            <CallNotification>
              {t('DIALER.MESSAGES.TRANSMITTER_IS_CALLING', {
                transmitter: contactDisplay(call.transmitter) || call.transmitter,
              })}
            </CallNotification>
          ),
        },
        (n) => addNotification(n),
      );
    }
  };

  return { setNotification, clearNotification };
};
