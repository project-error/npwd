import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import { Button, ListItemAvatar, Avatar as MuiAvatar, List, ListItem } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { SearchContacts } from './SearchContacts';
import { useHistory } from 'react-router-dom';
import LogDebugEvent from '../../../../os/debug/LogDebugEvents';
import { useFilteredContacts } from '../../hooks/state';
import { useCall } from '../../../../os/call/hooks/useCall';

export const ContactList: React.FC = () => {
  const filteredContacts = useFilteredContacts();
  const history = useHistory();
  const { initializeCall } = useCall();

  const openContactInfo = (contactId: number) => {
    history.push(`/contacts/${contactId}`);
  };

  const startCall = (number: string) => {
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    initializeCall(number);
  };

  const handleMessage = (phoneNumber: string) => {
    LogDebugEvent({
      action: 'Routing to Message',
      level: 1,
      data: { phoneNumber },
    });
    history.push(`/messages/new/${phoneNumber}`);
  };

  return (
    <>
      <SearchContacts />
      <List>
        {filteredContacts.map((contact) => (
          <ListItem key={contact.id} divider>
            <ListItemAvatar>
              {contact.avatar ? (
                <MuiAvatar src={contact.avatar} />
              ) : (
                <MuiAvatar>{contact.display.slice(0, 1).toUpperCase()}</MuiAvatar>
              )}
            </ListItemAvatar>
            <ListItemText primary={contact.display} secondary={contact.number} />
            <Button onClick={() => startCall(contact.number)}>
              <PhoneIcon />
            </Button>
            <Button onClick={() => handleMessage(contact.number)}>
              <ChatIcon />
            </Button>
            <Button style={{ margin: -15 }} onClick={() => openContactInfo(contact.id)}>
              <MoreVertIcon />
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};
