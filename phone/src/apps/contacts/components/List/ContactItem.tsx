import { ListItemText, ListItem, ListItemAvatar, Avatar as MuiAvatar } from '@mui/material';
import React from 'react';

interface ContactItemProps {
  id: number;
  display: string;
  number: string;
  avatar: string;
  render: React.ReactNode;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  id,
  display,
  number,
  avatar,
  render,
}) => {
  return (
    <ListItem key={id} divider>
      <ListItemAvatar>
        {avatar ? (
          <MuiAvatar src={avatar} />
        ) : (
          <MuiAvatar>{display.slice(0, 1).toUpperCase()}</MuiAvatar>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={display}
        secondary={number}
        primaryTypographyProps={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        secondaryTypographyProps={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      />
      {render}
    </ListItem>
  );
};
