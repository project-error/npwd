import React from 'react';

import { cn } from '../utils';

export type PhoneFrameColor = 'titanium' | 'black' | 'violet' | 'white' | 'blue' | 'green';

export interface PhoneFrameChassisProps {
  children: React.ReactNode;
  color?: PhoneFrameColor;
  className?: string;
  screenClassName?: string;
  screenStyle?: React.CSSProperties;
}

export const PhoneFrameChassis: React.FC<PhoneFrameChassisProps> = ({
  children,
  color = 'titanium',
  className,
  screenClassName,
  screenStyle,
}) => (
  <div aria-hidden={false} className={cn('phone-device-shell', className)} data-color={color}>
    <span aria-hidden className="phone-frame-button phone-frame-button--volume-up" />
    <span aria-hidden className="phone-frame-button phone-frame-button--volume-down" />
    <span aria-hidden className="phone-frame-button phone-frame-button--power" />

    <div
      id="phone"
      className={cn('phone-screen-samsung', screenClassName)}
      style={screenStyle}
    >
      {children}
    </div>

    <div aria-hidden className="phone-frame-punch-hole" />
  </div>
);
