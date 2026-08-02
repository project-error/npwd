import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import { CallTimer } from './CallTimer';
import { CallControls } from './CallControls';
import CallContactContainer from './CallContactContainer';
import RingingText from './RingingText';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useWallpaper } from '../../../apps/settings/hooks/useWallpaper';
import { cn } from '@utils/css';

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
          <div
            className={cn(
              'flex h-full flex-col justify-between p-5',
              'backdrop-blur-[20px] brightness-[0.6]',
            )}
          >
            <div>
              <CallContactContainer />
              {call?.is_accepted ? <CallTimer /> : call?.isTransmitter && <RingingText />}
            </div>
            <CallControls />
          </div>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
