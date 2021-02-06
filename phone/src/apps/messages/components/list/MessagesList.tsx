import React, { useEffect, useState } from 'react';
import { List } from '@material-ui/core';
import qs from 'qs';
import { MessageGroup } from '../../../../common/typings/messages';
import Nui from '../../../../os/nui-events/utils/Nui';
import useMessages from '../../hooks/useMessages';
import MessageSearch from './MessageSearch';
import MessageGroupItem from './MessageGroupItem';
import useStyles from './list.styles';
import { useHistory } from 'react-router-dom';
import NewMessageGroupButton from '../buttons/NewMessageGroupButton';

const MessagesList = (): any => {
  const classes = useStyles();
  const history = useHistory();

  const { messageGroups } = useMessages();

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    Nui.send('phone:fetchMessageGroups');
  }, []);

  if (!messageGroups) return null;

  const handleClick = (messageGroup: MessageGroup) => () => {
    Nui.send('phone:fetchMessages', { groupId: messageGroup.groupId });
    history.push(
      `/messages/conversations/${messageGroup.groupId}/?${qs.stringify(
        messageGroup
      )}`
    );
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
      <NewMessageGroupButton onClick={() => history.push('/messages/new')} />
    </>
  );
};

export default MessagesList;
