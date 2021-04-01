import React from 'react';
import { Avatar, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useContacts } from '../../../apps/contacts/hooks/useContacts';
import { useCall } from '../hooks/useCall';

const useStyles = makeStyles({
  image: {
    width: 80,
    height: 80,
  },
});

const CallContactContainer = () => {
  const { call } = useCall();
  const classes = useStyles();

  const { getDisplayByNumber, getPictureByNumber } = useContacts();

  const getDisplayOrNumber = () =>
    call.isTransmitter ? getDisplayByNumber(call?.receiver) : getDisplayByNumber(call?.transmitter);

  return (
    <Box display="flex" alignItems="center">
      <Box style={{ flexGrow: 1 }}>
        <Typography variant="body1">
          {call.isTransmitter ? 'OUTGOING CALL' : 'INCOMING CALL'}
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
