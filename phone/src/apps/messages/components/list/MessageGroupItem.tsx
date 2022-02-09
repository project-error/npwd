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
  checked: number[];
  handleToggle: (id: number) => void;
}

const MessageGroupItem = ({
  messageConversation,
  handleClick,
  isEditing,
  checked,
  handleToggle,
}: IProps): any => {
  const toggleCheckbox = () => {
    handleToggle(messageConversation.id);
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
      key={messageConversation.id}
      onClick={!isEditing ? handleClick(messageConversation) : toggleCheckbox}
      divider
      button
    >
      {isEditing && (
        <ListItemIcon>
          <Checkbox edge="start" disableRipple />
        </ListItemIcon>
      )}
      <ListItemAvatar>
        <Badge
          color="error"
          badgeContent={messageConversation.unread <= 99 ? messageConversation.unread : '99+'}
          invisible={messageConversation.unread <= 0}
        >
          <MuiAvatar src={contactDisplay(messageConversation.participant)?.avatar} />
        </Badge>
      </ListItemAvatar>
      <ListItemText sx={{ overflow: 'hidden' }}>
        {contactDisplay(messageConversation.participant)?.display ||
          messageConversation.participant}
      </ListItemText>
    </ListItem>
  );
};

export default MessageGroupItem;
