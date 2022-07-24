import React, { useEffect, useRef, useState } from 'react';
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
  Slide,
} from '@mui/material';
import CallContactContainer from './EmergencyContactContainer';
import RingingText from './RingingText';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useWallpaper } from '../../../apps/settings/hooks/useWallpaper';
import { styled } from '@mui/styles';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { Account, BankingEvents, TransactionStatus } from '@typings/banking';
import {
  AnimationModel,
  AudioEventArguments,
  AudioTypes,
  EmergencyEvents,
} from '@typings/emergency';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import HealingIcon from '@mui/icons-material/Healing';
import { EmergencyChoice } from '@os/emergency/components/EmergencyChoice';
import { isEnvBrowser } from '@utils/misc';
import { DispatchIntro } from '@os/emergency/config';
import '../utils';

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
  const [context, setContext] = useState(null);
  //if (!call) return null;
  useEffect(() => {
    if (isEnvBrowser()) {
      DispatchIntro.play().then((playback) => {
        setTimeout(() => {
          setContext(<EmergencyChoice setContext={setContext} />);
        }, DispatchIntro.duration * 1000);
      });
    } else {
      fetchNui<ServerPromiseResp<AnimationModel>>(EmergencyEvents.ANIMATION, {
        isCalling: true,
      });
      console.log('fetching nui PLAY_AUDIO');
      fetchNui<ServerPromiseResp<AudioEventArguments>>(EmergencyEvents.PLAY_AUDIO, {
        type: AudioTypes.START_CALL,
      }).then((data) => {
        console.log('played nui PLAY_AUDIO');
        DispatchIntro.play().then((playback) => {
          setTimeout(() => {
            setContext(<EmergencyChoice setContext={setContext} />);
          }, DispatchIntro.duration * 1000);
        });
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
              <EmergencyTimer />
              <RingingText />
            </Box>
            {context}
            <EmergencyControls />
          </StyledBoxRoot>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
