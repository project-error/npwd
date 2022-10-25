import React from 'react';
import { Avatar, Box, ListItemAvatar, ListItemText } from '@mui/material';
import { ChannelItemProps } from '@typings/darkchat';
import { ListItem } from '@ui/components/ListItem';
import { useHistory } from 'react-router-dom';
import { useSetActiveDarkchatState } from '../../state/state';

export const ChannelItem: React.FC<ChannelItemProps> = (item) => {
  const history = useHistory();
  const setActiveConversation = useSetActiveDarkchatState();

  const handleGoToConversation = () => {
    setActiveConversation(item);
    history.push(`/darkchat/conversation/${item.id}`);
  };

  return (
    <ListItem button onClick={handleGoToConversation}>
      <ListItemAvatar>
        <Avatar alt="dark dark chat" />
      </ListItemAvatar>
      <ListItemText primary={item.label ?? item.identifier} />
    </ListItem>
  );
};
