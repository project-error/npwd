import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import { CallTimer } from './CallTimer';
import { CallControls } from './CallControls';
import { Box } from '@mui/material';
import CallContactContainer from './CallContactContainer';
import makeStyles from '@mui/styles/makeStyles';
import RingingText from './RingingText';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useWallpaper } from '../../../apps/settings/hooks/useWallpaper';

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
  const { call } = useCall();
  const wallpaper = useWallpaper();

  const classes = useStyles();

  if (!call) return null;

  return (
    <AppWrapper>
      <AppContent
        paperStyle={{
          backgroundImage: wallpaper,
        }}
      >
        <React.Suspense fallback={<LoadingSpinner />}>
          <Box className={classes.root} padding={5}>
            <Box>
              <CallContactContainer />
              {call?.is_accepted ? <CallTimer /> : call?.isTransmitter && <RingingText />}
            </Box>
            <CallControls />
          </Box>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
