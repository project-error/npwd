import React from 'react';
import { Box, IconButton, List } from '@mui/material';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import MessageGroupItem from './MessageGroupItem';
import useStyles from './list.styles';
import { SearchField } from '@ui/components/SearchField';
import { useTranslation } from 'react-i18next';
import {
  useCheckedConversations,
  useFilteredConversationsValue,
  useFilterValueState,
  useIsEditing,
} from '../../hooks/state';
import EditIcon from '@mui/icons-material/Edit';

const MessagesList = (): any => {
  const [isEditing, setIsEditing] = useIsEditing();
  const [checkedConversation, setCheckedConversation] = useCheckedConversations();

  const classes = useStyles();
  const [t] = useTranslation();

  const { conversations, goToConversation } = useMessages();

  const filteredConversations = useFilteredConversationsValue();
  const [searchValue, setSearchValue] = useFilterValueState();

  if (!conversations) return <p>No messages</p>;

  const handleClick = (conversation: MessageConversation) => () => {
    goToConversation(conversation);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleToggleConversation = (conversationId: string) => {
    const currentIndex = checkedConversation.indexOf(conversationId);
    const newChecked = [...checkedConversation];

    if (currentIndex === -1) {
      newChecked.push(conversationId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedConversation(newChecked);
  };

  return (
    <Box display="flex" flexDirection="column">
      {conversations.length && (
        <Box position="absolute" top={10} right={3}>
          <IconButton onClick={toggleEdit}>
            <EditIcon />
          </IconButton>
        </Box>
      )}
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
                handleToggle={handleToggleConversation}
                isEditing={isEditing}
                checked={checkedConversation}
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
