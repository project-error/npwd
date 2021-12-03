import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import { CallTimer } from './CallTimer';
import { CallControls } from './CallControls';
import { Box } from '@mui/material';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import getBackgroundPath from '../../../apps/settings/utils/getBackgroundPath';
import CallContactContainer from './CallContactContainer';
import makeStyles from '@mui/styles/makeStyles';
import RingingText from './RingingText';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const useStyles = makeStyles({
  root: {
    height: '100%',
    backdropFilter: 'blur(20px) brightness(0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export const CallModal: React.FC = () => {
  const [settings] = useSettings();
  const { call } = useCall();

  const classes = useStyles();

  if (!call) return null;

  return (
    <AppWrapper>
      <AppContent
        paperStyle={{
          backgroundImage: `url(${getBackgroundPath(settings.wallpaper.value)})`,
        }}
      >
        <React.Suspense fallback={<LoadingSpinner />}>
          <Box className={classes.root} padding={5}>
            <Box>
              <CallContactContainer />
              {call.is_accepted ? <CallTimer /> : call.isTransmitter && <RingingText />}
            </Box>
            <CallControls />
          </Box>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
