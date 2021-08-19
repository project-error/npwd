import React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar as MuiAvatar, Badge } from '@mui/material';

import { MessageConversation, MessageGroup } from '../../../../../../typings/messages';
interface IProps {
  messageConversation: MessageConversation;
  handleClick: (conversations: MessageConversation) => () => void;
}

const MessageGroupItem = ({ messageConversation, handleClick }: IProps): any => {
  // get unread messages, check the length. If we have any, get the groupId,
  // and show the badge

  /* const hasUnread = messageConversation.unreadCount > 0; */

  return (
    <ListItem
      key={messageConversation.conversation_id}
      onClick={handleClick(messageConversation)}
      divider
      button
    >
      <ListItemAvatar>
        <Badge color="error" variant="dot">
          <MuiAvatar src={messageConversation.avatar} />
        </Badge>
      </ListItemAvatar>
      <ListItemText>{messageConversation.display || messageConversation.phoneNumber}</ListItemText>
    </ListItem>
  );
};

export default MessageGroupItem;
