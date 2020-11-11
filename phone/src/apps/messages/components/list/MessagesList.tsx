import { List, ListItem, ListItemText, ListItemAvatar, Avatar as MuiAvatar } from '@material-ui/core';
import React from 'react'
import { useMessageModal } from '../../hooks/useMessageModal';

import { useMessages } from '../../hooks/useMessages';

const MessagesList = (): any => {
  const {messages, setMessages} = useMessages();
  const { setMessageModal } = useMessageModal()

  const handleConversation = (message) => {
    setMessageModal(true)
    setMessages(message)
  }
  
  return (
    <List>
      {messages.map((message) => (
        <ListItem divider onClick={() => handleConversation(message)} button key={message.receiver}>
          <ListItemAvatar>
            <MuiAvatar />
          </ListItemAvatar>
          <ListItemText>
            {message.receiver}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

export default MessagesList;
