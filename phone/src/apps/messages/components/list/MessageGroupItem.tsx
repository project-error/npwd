import React from 'react'
import { ListItem, ListItemText, ListItemAvatar, Avatar as MuiAvatar } from '@material-ui/core';

import { MessageGroup } from '../../../../common/interfaces/messages';

interface IProps {
  messageGroup: MessageGroup;
  handleClick: (group: MessageGroup) => () => void;
}

const MessageGroupItem = ({ messageGroup, handleClick }: IProps): any => {
  return (
    <ListItem
      key={messageGroup.groupId}
      onClick={handleClick(messageGroup)}
      divider
      button
    >
    <ListItemAvatar>
        <MuiAvatar src={messageGroup?.avatar} />
    </ListItemAvatar>
    <ListItemText>
        {messageGroup.label || messageGroup.groupDisplay}
    </ListItemText>
    </ListItem>
  )
}

export default MessageGroupItem;
