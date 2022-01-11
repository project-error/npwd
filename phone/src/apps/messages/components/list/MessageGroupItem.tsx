import React, { useCallback } from 'react';
import {
  ListItem,
  ListItemText,
  Checkbox,
  ListItemAvatar,
  Avatar as MuiAvatar,
  Badge,
  ListItemIcon,
} from '@mui/material';

import { MessageConversation } from '@typings/messages';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useContacts } from '../../../contacts/hooks/state';
import { Contact } from '@typings/contact';

interface IProps {
  messageConversation: MessageConversation;
  handleClick: (conversations: MessageConversation) => () => void;
  isEditing: boolean;
  checked: string[];
  handleToggle: (id: string) => void;
}

const MessageGroupItem = ({
  messageConversation,
  handleClick,
  isEditing,
  checked,
  handleToggle,
}: IProps): any => {
  const toggleCheckbox = () => {
    handleToggle(messageConversation.conversation_id);
  };

  const contacts = useContacts();
  const { getContactByNumber } = useContactActions();

  const contactDisplay = useCallback(
    (number: string): Contact | null => {
      return contacts.length ? getContactByNumber(number) : null;
    },
    [contacts, getContactByNumber],
  );

  return (
    <ListItem
      key={messageConversation.conversation_id}
      onClick={!isEditing ? handleClick(messageConversation) : toggleCheckbox}
      divider
      button
    >
      {isEditing && (
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.indexOf(messageConversation.conversation_id) !== -1}
            disableRipple
          />
        </ListItemIcon>
      )}
      <ListItemAvatar>
        <Badge color="error" variant="dot" invisible={messageConversation.unread <= 0}>
          <MuiAvatar src={contactDisplay(messageConversation.phoneNumber)?.avatar} />
        </Badge>
      </ListItemAvatar>
      <ListItemText sx={{ overflow: 'hidden' }}>
        {contactDisplay(messageConversation.phoneNumber)?.display ||
          messageConversation.phoneNumber}
      </ListItemText>
    </ListItem>
  );
};

export default MessageGroupItem;
