import React from 'react';
import { CallControls } from './CallControls';

interface CallNotificationProps {
  children: React.ReactNode;
}

export const CallNotification: React.FC<CallNotificationProps> = ({ children }) => (
  <div className="pb-12">
    <div>{children}</div>
    <div className="absolute bottom-1 right-0">
      <CallControls isSmall />
    </div>
  </div>
);
