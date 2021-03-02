import React, { useCallback, useEffect, useState } from 'react';
import { List } from '@material-ui/core';
import qs from 'qs';
import { MessageGroup } from '../../../../common/typings/messages';
import Nui from '../../../../os/nui-events/utils/Nui';
import useMessages from '../../hooks/useMessages';
import MessageSearch from './MessageSearch';
import MessageGroupItem from './MessageGroupItem';
import useStyles from './list.styles';
import { useHistory } from 'react-router-dom';
import {useMessageNotifications} from "../../hooks/useMessageNotifications";
import { goToConversation } from '../../utils/goToConversation';

const MessagesList = (): any => {
  const classes = useStyles();
  const history = useHistory();
  const { setUnreadCount } = useMessageNotifications()

  const { messageGroups, createMessageGroupResult, clearMessageGroupResult } = useMessages();

  const [searchValue, setSearchValue] = useState('');

  
  const formattedSearch = searchValue.toLowerCase().trim();
  const filteredGroups = formattedSearch
    ? messageGroups.filter((group) => {
      const groupDisplay = group.groupDisplay.toLowerCase();
      const displayIncludes = groupDisplay.includes(formattedSearch);

      const label = group.label?.toLowerCase();
      return label
        ? displayIncludes || label.includes(formattedSearch)
        : displayIncludes;
    })
    : messageGroups;

  useEffect(() => {
    if (createMessageGroupResult?.groupId) {
      const findGroup = messageGroups.find((g) => g.groupId === createMessageGroupResult.groupId);
      clearMessageGroupResult();
      if (findGroup) {
        goToConversation(findGroup, history);
      }
    }
  }, [messageGroups, createMessageGroupResult, goToConversation, clearMessageGroupResult]);

  useEffect(() => {
    if (filteredGroups?.length) {
      setUnreadCount(0);
    }
  }, [setUnreadCount, filteredGroups]);

  if (!messageGroups) return null;

  const handleClick = (messageGroup: MessageGroup) => () => {
    Nui.send('phone:fetchMessages', { groupId: messageGroup.groupId });
    history.push(`/messages/conversations/${messageGroup.groupId}/?${qs.stringify(messageGroup)}`);
  };

  return (
    <>
      <MessageSearch value={searchValue} handleChange={(e) => setSearchValue(e.target.value)} />
      <List className={classes.root}>
        {filteredGroups.map((messageGroup) => (
          <MessageGroupItem
            key={messageGroup.groupId}
            messageGroup={messageGroup}
            handleClick={handleClick}
          />
        ))}
      </List>
    </>
  );
};

export default MessagesList;
