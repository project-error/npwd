import React, { useEffect, useState } from 'react';
import { Box, List } from '@material-ui/core';
import { MessageConversation } from '../../../../../../typings/messages';
import useMessages from '../../hooks/useMessages';
import MessageGroupItem from './MessageGroupItem';
import useStyles from './list.styles';
import { SearchField } from '../../../../ui/components/SearchField';
import { useTranslation } from 'react-i18next';
import {
  useFilteredConversationsValue,
  useFilterValueState,
  useMessageConversationValue,
} from '../../hooks/state';

const MessagesList = (): any => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { conversations, goToConversation } = useMessages();

  const filteredConversations = useFilteredConversationsValue();
  const [searchValue, setSearchValue] = useFilterValueState();

  if (!conversations) return <p>No messages</p>;

  const handleClick = (conversation: MessageConversation) => () => {
    goToConversation(conversation);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <SearchField
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t('APPS_MESSAGES_SEARCH_PLACEHOLDER')}
        />
      </Box>
      <Box display="flex" flexDirection="column">
        <Box className={classes.root}>
          <List>
            {filteredConversations.map((conversation) => (
              <MessageGroupItem
                key={conversation.conversation_id}
                messageConversation={conversation}
                handleClick={handleClick}
              />
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default MessagesList;
