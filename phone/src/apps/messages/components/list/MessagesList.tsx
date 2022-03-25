import React, { useEffect, useState } from 'react';
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
  useIsEditing,
  useSetFilterValue,
} from '../../hooks/state';
import { useDebounce } from '@os/phone/hooks/useDebounce';
import EditIcon from '@mui/icons-material/Edit';
import { useMessageAPI } from '../../hooks/useMessageAPI';

const MessagesList = (): any => {
  const [isEditing, setIsEditing] = useIsEditing();
  const [checkedConversation, setCheckedConversation] = useCheckedConversations();

  const classes = useStyles();
  const [t] = useTranslation();

  const { conversations, goToConversation } = useMessages();

  const { setMessageRead } = useMessageAPI();

  const filteredConversations = useFilteredConversationsValue();
  const setFilterVal = useSetFilterValue();

  const [inputVal, setInputVal] = useState('');

  const debouncedVal = useDebounce<string>(inputVal, 200);

  useEffect(() => {
    setFilterVal(debouncedVal);
  }, [debouncedVal, setFilterVal]);

  if (!conversations) return <p>No messages</p>;

  const handleClick = (conversation: MessageConversation) => () => {
    setMessageRead(conversation.id);
    goToConversation(conversation);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleToggleConversation = (conversationId: number) => {
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
      {!!conversations.length && (
        <Box position="absolute" top={10} right={3}>
          <IconButton onClick={toggleEdit}>
            <EditIcon />
          </IconButton>
        </Box>
      )}
      <Box>
        <SearchField
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={t('MESSAGES.SEARCH_PLACEHOLDER')}
        />
      </Box>
      <Box display="flex" flexDirection="column">
        <Box className={classes.root}>
          <List>
            {[...filteredConversations]
              .sort((a, b) => {
                return b.updatedAt - a.updatedAt;
              })
              .map((conversation) => (
                <MessageGroupItem
                  handleToggle={handleToggleConversation}
                  isEditing={isEditing}
                  checked={checkedConversation}
                  key={conversation.id}
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
