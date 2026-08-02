import React from 'react';

import { useSettings } from './apps/settings/hooks/useSettings';

import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';

import { useWallpaper } from './apps/settings/hooks/useWallpaper';

import { useLocation } from 'react-router';

import { PhoneFrameColor, PhoneOSShell } from '@npwd/keyos';

interface PhoneWrapperProps {
  children: React.ReactNode;
}

const SAMSUNG_FRAME_COLORS: Record<string, PhoneFrameColor> = {
  'samsung-titanium': 'titanium',
  'samsung-black': 'black',
  'samsung-violet': 'violet',
  'samsung-white': 'white',
  'samsung-blue': 'blue',
  'samsung-green': 'green',
};

const parseFrameSettings = (frameValue: string) => {
  const samsungColor = SAMSUNG_FRAME_COLORS[frameValue.replace(/\.png$/, '')];

  if (samsungColor) {
    return {
      frameVariant: 'samsung' as const,
      frameColor: samsungColor,
      frameImage: undefined,
    };
  }

  if (frameValue.startsWith('samsung-')) {
    const color = (frameValue.replace('samsung-', '') as PhoneFrameColor) || 'titanium';
    return {
      frameVariant: 'samsung' as const,
      frameColor: color,
      frameImage: undefined,
    };
  }

  return {
    frameVariant: 'image' as const,
    frameColor: 'titanium' as const,
    frameImage: `media/frames/${frameValue}`,
  };
};

const PhoneWrapper: React.FC<PhoneWrapperProps> = ({ children }) => {
  const [settings] = useSettings();
  const { bottom, visibility } = usePhoneVisibility();
  const wallpaper = useWallpaper();
  const { pathname } = useLocation();
  const frameSettings = parseFrameSettings(settings.frame.value);

  return (
    <PhoneOSShell
      bottom={bottom}
      className="keyos-ui dark"
      data-theme="dark"
      frameColor={frameSettings.frameColor}
      frameImage={frameSettings.frameImage}
      frameVariant={frameSettings.frameVariant}
      screenClassName="PhoneScreen"
      screenStyle={{
        backgroundImage: pathname === '/' ? wallpaper : undefined,
      }}
      visible={visibility}
      zoom={settings.zoom.value}
    >
      {children}
    </PhoneOSShell>
  );
};

export default PhoneWrapper;
