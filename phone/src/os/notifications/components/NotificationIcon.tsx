import React from 'react';
import { IconButton } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface INotificationIcon {
  icon: JSX.Element;
  to: string;
}

export const NotificationIcon = ({ icon, to }: INotificationIcon) => {
  return (
    <IconButton component={NavLink} to={to} size="small">
      {icon}
    </IconButton>
  );
};
