import React from 'react';
import {
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
} from '@material-ui/core';
interface IProps {
  options?: any;
  label: string;
  value?: string | null;
  onClick?: any;
  icon: JSX.Element;
  disabled?: boolean;
}

export const SettingItem = ({
  options,
  label,
  value,
  onClick,
  icon,
  disabled,
}: IProps) => {
  return (
    <>
      <ListItem onClick={() => onClick(options)} button>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} secondary={value ? value : undefined} />
      </ListItem>
      <Divider />
    </>
  );
};
