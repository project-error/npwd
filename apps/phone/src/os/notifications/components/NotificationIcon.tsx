import React from 'react';
import { buttonVariants } from '@npwd/keyos';
import { NavLink } from 'react-router';
import { cn } from '@utils/css';

interface INotificationIcon {
  icon: JSX.Element;
  to: string;
}

export const NotificationIcon = ({ icon, to }: INotificationIcon) => {
  return (
    <NavLink
      className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
      to={to}
    >
      {icon}
    </NavLink>
  );
};
