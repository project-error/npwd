import React from 'react';
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
  const { getContactByNumber } = useContactActions();

  const conversationContact = getContactByNumber(messageConversation.phoneNumber);

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
        <Badge color="error" variant="dot" invisible={messageConversation.unread > 0}>
          <MuiAvatar src={conversationContact?.avatar} />
        </Badge>
      </ListItemAvatar>
      <ListItemText>{conversationContact?.display || messageConversation.phoneNumber}</ListItemText>
    </ListItem>
  );
};

export default MessageGroupItem;
