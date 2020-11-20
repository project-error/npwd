import React, { useEffect } from 'react'
import { List, ListItem, ListItemText, ListItemAvatar, Avatar as MuiAvatar } from '@material-ui/core';

import { MessageGroup } from '../../../../common/interfaces/messages';
import Nui from '../../../../os/nui-events/utils/Nui';
import useMessages from '../../hooks/useMessages';
import useModals from '../../hooks/useModals';
import useStyles from './list.styles';

const MessagesList = (): any => {
  const classes = useStyles();
  const { messageGroups } = useMessages();
  const { setActiveMessageGroup } = useModals();

  useEffect(() => {
    Nui.send('phone:fetchMessageGroups');
  }, []);

  if (!messageGroups) return null;

  const handleClick = (messageGroup: MessageGroup) => () => {
    setActiveMessageGroup(messageGroup);
    Nui.send('phone:fetchMessages', { groupId: messageGroup.groupId });
  }
  
  return (
    <List className={classes.root}>
      {messageGroups.map((messageGroup) => (
        <ListItem
          key={messageGroup.groupId}
          onClick={handleClick(messageGroup)}
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
