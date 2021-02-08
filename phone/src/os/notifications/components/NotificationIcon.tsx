import React from 'react';
import { IconButton } from '@material-ui/core';

interface INotificationIcon {
  icon: JSX.Element;
  onClick(e: any): void;
}

export const NotificationIcon = ({ icon, onClick }: INotificationIcon) => {
  return (
    <IconButton size="small" onClick={onClick}>
      {icon}
    </IconButton>
  );
};
