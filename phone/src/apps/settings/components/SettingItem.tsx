import React from 'react';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';

interface IProps {
  options?: any;
  label: string;
  value?: string | number | null;
  onClick?: any;
  icon: JSX.Element;
}

export const SettingItem = ({ options, label, value, onClick, icon }: IProps) => {
  return (
    <ListItem divider onClick={() => onClick?.(options)} button>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={value ? value : undefined} />
    </ListItem>
  );
};
