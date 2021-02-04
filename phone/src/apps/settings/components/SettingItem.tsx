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
  value?: string | number | null;
  onClick?: any;
  icon: JSX.Element;
}

export const SettingItem = ({
  options,
  label,
  value,
  onClick,
  icon
}: IProps) => {
  if (!onClick)
    return (
      <>
        <ListItem button>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} secondary={value ? value : undefined} />
        </ListItem>
        <Divider />
      </>
    );

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
