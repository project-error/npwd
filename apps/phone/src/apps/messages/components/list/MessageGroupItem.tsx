import React, { useCallback } from 'react';
import {
  ListItemText,
  Checkbox,
  ListItemAvatar,
  Avatar as MuiAvatar,
  Badge,
  ListItemIcon,
  colors,
  useTheme,
} from '@mui/material';

import { MessageConversation } from '@typings/messages';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useContacts } from '../../../contacts/hooks/state';
import { Contact } from '@typings/contact';
import { ListItem } from '@npwd/keyos';
import { initials } from '@utils/misc';

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

  const getContact = useCallback((): Contact | null => {
    // This is the source
    const participant = messageConversation.participant;
    const conversationList = messageConversation.conversationList.split('+');

    for (const p of conversationList) {
      if (p !== participant) {
        const contact = contactDisplay(p);
        return contact || null;
      }
    }
  }, [contactDisplay, messageConversation]);

  const getLabelOrContact = useCallback((): Contact | string => {
    const conversationLabel = messageConversation.label;
    // This is the source
    const participant = messageConversation.participant;
    const conversationList = messageConversation.conversationList.split('+');

    // Label is required if the conversation is a group chat
    if (messageConversation.isGroupChat) return conversationLabel;

    return getContact()?.display || conversationList.filter((p) => p !== participant)[0];
  }, [messageConversation, getContact]);

  return (
    <ListItem
      key={messageConversation.id}
      button
      onClick={!isEditing ? handleClick(messageConversation) : toggleCheckbox}
      primaryText={getLabelOrContact()}
      startElement={
        <div className="flex items-center px-2">
          {isEditing && (
            <Checkbox
              checked={checked.indexOf(messageConversation.id) !== -1}
              edge="start"
              disableRipple
            />
          )}
          <div>
            {messageConversation.isGroupChat ? (
              <MuiAvatar alt={messageConversation.label} />
            ) : getContact()?.avatar && getContact()?.avatar.length > 0 ? (
              <img
                src={getContact()?.avatar}
                className="inline-block h-10 w-10 rounded-full"
                alt={'avatar'}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-gray-600 dark:text-gray-300">
                  {initials(getContact()?.display)}
                </span>
              </div>
            )}
          </div>
        </div>
      }
      endElement={
        <div>
          <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
            {messageConversation.unreadCount <= 99 ? messageConversation.unreadCount : '99+'}
          </span>
        </div>
      }
    >
      {/* isEditing && (
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
          {messageConversation.isGroupChat ? (
            <MuiAvatar alt={messageConversation.label} />
          ) : (
            <MuiAvatar alt={getContact()?.display ?? ''} src={getContact()?.avatar} />
          )}
        </Badge>
      </ListItemAvatar>
          <ListItemText sx={{ overflow: 'hidden', color: phoneTheme.palette.text.primary}}>{getLabelOrContact()}</ListItemText> */}
    </ListItem>
  );
};

export default MessageGroupItem;
