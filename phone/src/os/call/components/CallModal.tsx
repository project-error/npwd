import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import { CallTimer } from './CallTimer';
import { CallControls } from './CallControls';
import { Box } from '@material-ui/core';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import getBackgroundPath from '../../../apps/settings/utils/getBackgroundPath';
import CallContactContainer from './CallContactContainer';
import { makeStyles } from '@material-ui/core/styles';
import RingingText from './RingingText';

const useStyles = makeStyles({
  root: {
    height: '100%',
    backdropFilter: 'blur(20px) brightness(0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export const CallModal = () => {
  const [settings] = useSettings();
  const { call } = useCall();

  const classes = useStyles();

  return (
    <AppWrapper>
      <AppContent
        paperStyle={{
          backgroundImage: `url(${getBackgroundPath(settings.wallpaper.value)})`,
        }}
      >
        <Box className={classes.root} padding={5}>
          <Box>
            <CallContactContainer />
            {call.is_accepted ? <CallTimer /> : call.isTransmitter && <RingingText />}
          </Box>
          <CallControls />
        </Box>
      </AppContent>
    </AppWrapper>
  );
};
