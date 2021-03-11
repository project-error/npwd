import React from 'react';
import { AppWrapper } from '../../../ui/components/AppWrapper';
import { AppContent } from '../../../ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import useStyles from './modal.styles';
import CallTimer from './CallTimer';
import { CallControls } from './CallControls';
import { Box } from '@material-ui/core';
import { useSimcard } from '../../simcard/hooks/useSimcard';

export const CallModal = () => {
  const classes = useStyles();
  const { call } = useCall();
  const { number: myNumber } = useSimcard();

  return (
    <AppWrapper>
      <AppContent>
        <Box pt={24}>
          <h1 style={{ textAlign: 'center' }}>
            {myNumber === call?.transmitter ? call?.receiver : call?.transmitter}
          </h1>
          <CallTimer isAccepted={call?.accepted} />
        </Box>
        <div className={classes.actions}>
          <CallControls size="medium" />
        </div>
      </AppContent>
    </AppWrapper>
  );
};
