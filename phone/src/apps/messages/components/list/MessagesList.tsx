import { List, ListItem, ListItemText, ListItemAvatar, Avatar as MuiAvatar } from '@material-ui/core';
import React from 'react'
import { useMessageModal } from '../../hooks/useMessageModal';

import { useMessages } from '../../hooks/useMessages';

const MessagesList = (): any => {
  const messages = useMessages();
  const { setMessageModal } = useMessageModal()
  return (
    <List>
      {messages.map((message) => (
        <ListItem divider onClick={() => setMessageModal(true)} button key={message.id}>
          <ListItemAvatar>
            <MuiAvatar />
          </ListItemAvatar>
          <ListItemText secondary="hello, how are...">
            {message.name}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

export default MessagesList;
