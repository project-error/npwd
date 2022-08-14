import { Message } from '@typings/messages';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SystemMessage = ({ message, myNumber }: { message: Message; myNumber: string }) => {
  const [t] = useTranslation();
  const { getContactByNumber } = useContactActions();
  const getContact = (number: string) => {
    if (number === myNumber) {
      return 'You';
    }
    const contact = getContactByNumber(number);
    return contact ? contact.display : number;
  };

  return (
    <>
      {message.system_type === 'add' ? (
        <Typography fontSize={14}>{`${getContact(message.author)} ${t(
          'MESSAGES.SYSTEM_MESSAGES.ADDED',
        )} ${getContact(message.system_number)}`}</Typography>
      ) : message.system_type === 'remove' ? (
        <Typography fontSize={14}>{`${getContact(message.author)} ${t(
          'MESSAGES.SYSTEM_MESSAGES.REMOVED',
        )} ${getContact(message.system_number)}`}</Typography>
      ) : (
        message.system_type === 'leave' && (
          <Typography fontSize={14}>{`${getContact(message.author)} ${t(
            'MESSAGES.SYSTEM_MESSAGES.LEFT',
          )}`}</Typography>
        )
      )}
    </>
  );
};

export default SystemMessage;
