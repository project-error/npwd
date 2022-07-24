import React, { useEffect, useState } from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import { EmergencyTimer } from './emergencyTimer';
import { EmergencyControls } from './EmergencyControls';
import {
  Box,
  BoxProps,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CallContactContainer from './EmergencyContactContainer';
import RingingText from './RingingText';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useWallpaper } from '../../../apps/settings/hooks/useWallpaper';
import { styled } from '@mui/styles';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { Account, BankingEvents } from '@typings/banking';
import { AudioTypes, EmergencyEvents } from '@typings/emergency';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import HealingIcon from '@mui/icons-material/Healing';
import { EmergencyChoice } from '@os/emergency/components/emergencyChoice';
import { isEnvBrowser } from '@utils/misc';

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
  const [context, setContext] = useState(<></>);
  //if (!call) return null;
  useEffect(() => {
    if (isEnvBrowser()) {
      setContext(<EmergencyChoice setContext={setContext} />);
    } else {
      fetchNui<ServerPromiseResp<AudioTypes>>(EmergencyEvents.PLAY_AUDIO, {
        type: AudioTypes.START_CALL,
      }).then(() => {
        setContext(<EmergencyChoice setContext={setContext} />);
      });
    }
  }, []);

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
            {context}

            <EmergencyControls />
          </StyledBoxRoot>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
