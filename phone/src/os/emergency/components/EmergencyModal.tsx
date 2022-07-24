import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import { EmergencyTimer } from './emergencyTimer';
import { EmergencyControls } from './EmergencyControls';
import { Box, BoxProps } from '@mui/material';
import CallContactContainer from './EmergencyContactContainer';
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

export const EmergencyModal: React.FC = () => {
  //const { call } = useCall();
  const wallpaper = useWallpaper();

  //if (!call) return null;

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
              <EmergencyTimer /> <RingingText />
            </Box>
            <EmergencyControls />
          </StyledBoxRoot>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
