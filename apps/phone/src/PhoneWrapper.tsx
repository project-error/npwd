import React from 'react';
import { useSettings } from './apps/settings/hooks/useSettings';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import { Slide } from '@mui/material';
import { useWallpaper } from './apps/settings/hooks/useWallpaper';

type PhoneWrapperProps = {
  children: React.ReactNode;
};

const PhoneWrapper: React.FC<PhoneWrapperProps> = ({ children }) => {
  const [settings] = useSettings();
  const { bottom, visibility } = usePhoneVisibility();
  const wallpaper = useWallpaper();

  return (
    <div className="PhoneWrapper">
      <div
        className="Phone"
        style={{
          position: 'fixed',
          transformOrigin: 'right bottom',
          transform: `scale(${settings.zoom.value}`,
          bottom,
        }}
      >
        <div
          className="PhoneFrame"
          style={{
            backgroundImage: `url(media/frames/${settings.frame.value})`,
          }}
        />
        <div
          id="phone"
          className="PhoneScreen"
          style={{
            backgroundImage: wallpaper,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneWrapper;
