import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import { CallTimer } from './CallTimer';
import { CallControls } from './CallControls';
import { Box, BoxProps } from '@mui/material';
import CallContactContainer from './CallContactContainer';
import RingingText from './RingingText';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useWallpaper } from '../../../apps/settings/hooks/useWallpaper';
import { styled } from '@mui/styles';

const StyledBoxRoot: React.FC<BoxProps> = styled(Box)({
  height: '100%',
  backdropFilter: 'blur(20px) brightness(0.6)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const CallModal: React.FC = () => {
  const { call } = useCall();
  const wallpaper = useWallpaper();

  if (!call) return null;

  return (
    <AppWrapper>
      <AppContent
        paperStyle={{
          backgroundImage: wallpaper,
        }}
      >
        <React.Suspense fallback={<LoadingSpinner />}>
          <StyledBoxRoot padding={5}>
            <Box>
              <CallContactContainer />
              {call?.is_accepted ? <CallTimer /> : call?.isTransmitter && <RingingText />}
            </Box>
            <CallControls />
          </StyledBoxRoot>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
