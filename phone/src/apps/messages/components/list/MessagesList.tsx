import React, { useEffect, useState } from 'react';
import { List } from '@material-ui/core';

import { MessageGroup } from '../../../../common/typings/messages';
import Nui from '../../../../os/nui-events/utils/Nui';
import useMessages from '../../hooks/useMessages';
import useModals from '../../hooks/useModals';
import MessageSearch from './MessageSearch';
import MessageGroupItem from './MessageGroupItem';
import useStyles from './list.styles';

const MessagesList = (): any => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const { messageGroups } = useMessages();
  const { setActiveMessageGroup } = useModals();

  useEffect(() => {
    Nui.send('phone:fetchMessageGroups');
  }, []);

  if (!messageGroups) return null;

  const handleClick = (messageGroup: MessageGroup) => () => {
    setActiveMessageGroup(messageGroup);
    Nui.send('phone:fetchMessages', { groupId: messageGroup.groupId });
  };

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

  return (
    <>
      <MessageSearch
        value={searchValue}
        handleChange={(e) => setSearchValue(e.target.value)}
      />
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
