import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar as MuiAvatar,
  Badge,
} from '@material-ui/core';

import { MessageGroup } from '../../../../../../typings/messages';
interface IProps {
  messageGroup: MessageGroup;
  handleClick: (group: MessageGroup) => () => void;
}

const MessageGroupItem = ({ messageGroup, handleClick }: IProps): any => {
  // get unread messages, check the length. If we have any, get the groupId,
  // and show the badge

  const hasUnread = messageGroup.unreadCount > 0;

  return (
    <ListItem key={messageGroup.groupId} onClick={handleClick(messageGroup)} divider button>
      <ListItemAvatar>
        <Badge color="error" variant="dot" invisible={!hasUnread}>
          <MuiAvatar src={messageGroup?.avatar} />
        </Badge>
      </ListItemAvatar>
      <ListItemText>{messageGroup.label || messageGroup.groupDisplay}</ListItemText>
    </ListItem>
  );
};

export default MessageGroupItem;
