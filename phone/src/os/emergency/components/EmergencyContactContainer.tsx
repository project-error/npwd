import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { useContactActions } from '../../../apps/contacts/hooks/useContactActions';
import { useCall } from '../hooks/useCall';
import { useTranslation } from 'react-i18next';

const EmergencyContactContainer = () => {
  const [t] = useTranslation();
  const { call } = useCall();

  const { getDisplayByNumber, getPictureByNumber } = useContactActions();

  const getDisplayOrNumber = () =>
    call.isTransmitter ? getDisplayByNumber(call?.receiver) : getDisplayByNumber(call?.transmitter);

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1} overflow="hidden" textOverflow="ellipsis">
        <Typography variant="body1">{t('CALLS.MESSAGES.OUTGOING').toUpperCase()}</Typography>
        <Typography variant="h4">911</Typography>
      </Box>
      <Avatar
        sx={{ ml: 1, height: 80, width: 80 }}
        alt="911"
        src={
          'https://cdn.discordapp.com/attachments/927456950092984330/1000788303836106832/unknown.png'
        }
      />
    </Box>
  );
};

export default EmergencyContactContainer;
