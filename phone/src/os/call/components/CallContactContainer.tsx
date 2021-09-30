import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useContactActions } from '../../../apps/contacts/hooks/useContactActions';
import { useCall } from '../hooks/useCall';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  image: {
    width: 80,
    height: 80,
  },
});

const CallContactContainer = () => {
  const { t } = useTranslation();
  const { call } = useCall();
  const classes = useStyles();

  const { getDisplayByNumber, getPictureByNumber } = useContactActions();

  const getDisplayOrNumber = () =>
    call.isTransmitter ? getDisplayByNumber(call?.receiver) : getDisplayByNumber(call?.transmitter);

  return (
    <Box display="flex" alignItems="center">
      <Box style={{ flexGrow: 1 }}>
        <Typography variant="body1">
          {call.isTransmitter
            ? t('CALLS.MESSAGES.OUTGOING').toUpperCase()
            : t('CALLS.MESSAGES.INCOMING').toUpperCase()}
        </Typography>
        <Typography variant="h4">{getDisplayOrNumber()}</Typography>
      </Box>
      <Avatar
        className={classes.image}
        alt={getDisplayOrNumber()}
        src={
          call.isTransmitter
            ? getPictureByNumber(call.receiver)
            : getPictureByNumber(call?.transmitter)
        }
      />
    </Box>
  );
};

export default CallContactContainer;
