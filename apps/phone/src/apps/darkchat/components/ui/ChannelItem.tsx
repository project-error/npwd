import React from 'react';
import { Avatar, ListItemAvatar, ListItemText, useTheme } from '@mui/material';
import { ChannelItemProps } from '@typings/darkchat';
import { ListItem } from '@ui/components/ListItem';
import { useHistory } from 'react-router-dom';
import { useSetActiveDarkchatState } from '../../state/state';

export const ChannelItem: React.FC<ChannelItemProps> = (item) => {
  const history = useHistory();
  const setActiveConversation = useSetActiveDarkchatState();
  const phoneTheme = useTheme();

  const handleGoToConversation = () => {
    setActiveConversation(item);
    history.push(`/darkchat/conversation/${item.id}`);
  };

  return (
    <ListItem button onClick={handleGoToConversation}>
      <ListItemAvatar>
        <Avatar alt="dark dark chat" />
      </ListItemAvatar>
      <ListItemText primary={item.label ?? item.identifier} style={{ color: phoneTheme.palette.text.primary }} />
    </ListItem>
  );
};
