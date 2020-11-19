import React from 'react'
import { List, ListItem, ListItemText, ListItemAvatar, Avatar as MuiAvatar } from '@material-ui/core';

import { useMessages } from '../../hooks/useMessages';
import useStyles from './list.styles';

const MessagesList = (): any => {
  const classes = useStyles();
  const { messages, setActiveMessageGroupId } = useMessages();

  return (
    <List className={classes.root}>
      {messages.map((messageGroup) => (
        <ListItem
          key={messageGroup.groupId}
          onClick={() => setActiveMessageGroupId(messageGroup.groupId)}
          divider
          button
        >
          <ListItemAvatar>
            <MuiAvatar />
          </ListItemAvatar>
          <ListItemText>
            {messageGroup.groupDisplay}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

export default MessagesList;
