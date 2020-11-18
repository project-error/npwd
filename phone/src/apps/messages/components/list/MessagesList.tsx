import { List, ListItem, ListItemText, ListItemAvatar, Avatar as MuiAvatar } from '@material-ui/core';
import React from 'react'
import { useConversation } from '../../hooks/useConversation';
import { useFilter } from '../../hooks/useFilter';
import { useMessageModal } from '../../hooks/useMessageModal';

import { useMessages } from '../../hooks/useMessages';

const MessagesList = (): any => {
  const { setMessageModal } = useMessageModal()
  const { conversation } = useConversation();
  const { setMessageFilter } = useFilter();

  const handleConversation = (convo) => {
    setMessageModal(true)
    setMessageFilter(convo)
  }
  
  if (!conversation) return <p>loading</p>

  return (
    <List>
      {conversation.map((convo) => (
        <ListItem divider button key={convo.name} onClick={() => handleConversation(convo)}> 
          <ListItemAvatar>
            <MuiAvatar />
          </ListItemAvatar>
          <ListItemText>
            {convo.name}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

export default MessagesList;
