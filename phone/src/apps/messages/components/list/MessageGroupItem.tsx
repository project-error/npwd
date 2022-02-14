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

  const getLabelOrContact = useCallback(() => {
    const conversationLabel = messageConversation.label;
    // This is the source
    const participant = messageConversation.participant;
    const conversationList = messageConversation.conversationList.split('+');

    // Label is required if the conversation is a group chat
    if (messageConversation.isGroupChat) return conversationLabel;

    for (const p of conversationList) {
      if (p !== participant) {
        const contact = contactDisplay(p);
        return contact ? contact.display : p;
      }
    }
  }, [messageConversation, contactDisplay]);

  return (
    <ListItem
      key={messageConversation.id}
      onClick={!isEditing ? handleClick(messageConversation) : toggleCheckbox}
      divider
      button
    >
      {isEditing && (
        <ListItemIcon>
          <Checkbox
            checked={checked.indexOf(messageConversation.id) !== -1}
            edge="start"
            disableRipple
          />
        </ListItemIcon>
      )}
      <ListItemAvatar>
        <Badge
          color="error"
          badgeContent={
            messageConversation.unreadCount <= 99 ? messageConversation.unreadCount : '99+'
          }
          invisible={messageConversation.unreadCount <= 0}
        >
          <MuiAvatar />
        </Badge>
      </ListItemAvatar>
      <ListItemText sx={{ overflow: 'hidden' }}>{getLabelOrContact()}</ListItemText>
    </ListItem>
  );
};

export default MessageGroupItem;
